"""루트 README.md의 문제 목록을 각 폴더의 README.md에서 다시 만들어 낸다.

코드트리 연동이 새 문제 폴더를 커밋한 뒤 이 스크립트를 실행하면
루트 인덱스가 최신 상태로 갱신된다.

    python3 scripts/build_readme.py
"""

from __future__ import annotations

import re
import urllib.parse
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECTIONS = [
    ("trail1", "Trail 1 · Novice Low"),
    ("samsung-sw", "삼성 SW 역량 테스트"),
]

TITLE_RE = re.compile(r"^#\s*\[(?P<title>.+)\]\((?P<url>[^)]+)\)\s*$")
FIELD_RE = re.compile(r"^\|\s*(?P<key>[^|]+?)\s*\|\s*(?P<value>.+?)\s*\|\s*$")
LINK_RE = re.compile(r"^\[(?P<text>.+)\]\((?P<url>[^)]+)\)$")
TAG_RE = re.compile(r"^\[(?P<tag>[^\]]+)\]\s*(?P<name>.+)$")


@dataclass
class Problem:
    directory: Path
    name: str
    tag: str
    url: str
    curriculum: str
    difficulty: str
    kind: str
    solution: Path | None

    @property
    def group(self) -> str:
        """`Trail 1 / 조건문 / and 연산자` 에서 가운데 단원명만 뽑는다."""
        parts = [p.strip() for p in self.curriculum.split("/")]
        return parts[1] if len(parts) >= 2 else (parts[0] if parts else "기타")

    @property
    def topic(self) -> str:
        parts = [p.strip() for p in self.curriculum.split("/")]
        return parts[2] if len(parts) >= 3 else ""


def encode(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return urllib.parse.quote(rel)


def parse(directory: Path) -> Problem | None:
    readme = directory / "README.md"
    if not readme.is_file():
        return None

    title = url = ""
    fields: dict[str, str] = {}
    for line in readme.read_text(encoding="utf-8").splitlines():
        if not title:
            matched = TITLE_RE.match(line)
            if matched:
                title, url = matched.group("title"), matched.group("url")
                continue
        field = FIELD_RE.match(line)
        if field:
            fields[field.group("key")] = field.group("value")

    if not title:
        return None

    tagged = TAG_RE.match(title)
    tag, name = (tagged.group("tag"), tagged.group("name")) if tagged else ("", title)

    curriculum = fields.get("커리큘럼", "")
    link = LINK_RE.match(curriculum)
    if link:
        curriculum = link.group("text")

    solutions = sorted(p for p in directory.iterdir() if p.name != "README.md" and p.is_file())

    return Problem(
        directory=directory,
        name=name.strip(),
        tag=tag.strip(),
        url=url,
        curriculum=curriculum,
        difficulty=fields.get("난이도", "-"),
        kind=fields.get("유형", ""),
        solution=solutions[0] if solutions else None,
    )


def collect() -> dict[str, list[Problem]]:
    found: dict[str, list[Problem]] = {}
    for key, _ in SECTIONS:
        base = ROOT / key
        if not base.is_dir():
            continue
        problems = [p for p in (parse(d) for d in sorted(base.iterdir()) if d.is_dir()) if p]
        if problems:
            found[key] = problems
    return found


def render_table(problems: list[Problem], with_topic: bool) -> list[str]:
    header = "| 문제 | 단원 | 난이도 | 풀이 |" if with_topic else "| 문제 | 유형 | 난이도 | 풀이 |"
    lines = [header, "|---|---|---|---|"]
    for p in problems:
        label = f"{p.name}" if not p.tag else f"{p.name} `{p.tag}`"
        problem_link = f"[{label}]({p.url})" if p.url else label
        second = p.topic if with_topic else (p.kind or p.tag)
        if p.solution:
            solution = f"[{p.solution.name}]({encode(p.solution)})"
        else:
            solution = f"[문제만]({encode(p.directory)})"
        lines.append(f"| {problem_link} | {second or '-'} | {p.difficulty} | {solution} |")
    return lines


def render(found: dict[str, list[Problem]]) -> str:
    total = sum(len(v) for v in found.values())
    languages: dict[str, int] = {}
    for problems in found.values():
        for p in problems:
            if p.solution:
                languages[p.solution.suffix.lstrip(".")] = languages.get(p.solution.suffix.lstrip("."), 0) + 1
    language_summary = ", ".join(f"{name} {count}문제" for name, count in sorted(languages.items(), key=lambda kv: -kv[1]))

    out = [
        "# 코드트리 풀이 기록",
        "",
        "[코드트리](https://www.codetree.ai/)에서 푼 문제를 저장소 연동 기능으로 모아 둔 곳입니다.",
        "문제 하나가 폴더 하나에 대응하며, 폴더 안에는 문제 정보를 담은 `README.md`와 제출한 풀이 코드가 들어 있습니다.",
        "",
        f"현재 {total}문제를 기록해 두었고, 풀이 언어는 {language_summary}입니다.",
        "코드 읽기 유형은 답만 제출하므로 풀이 파일 없이 문제 정보만 남아 있습니다.",
        "",
        "## 폴더 구조",
        "",
        "```",
        "├─ trail1/        Trail 1 커리큘럼 문제",
        "├─ samsung-sw/    삼성 SW 역량 테스트 기출",
        "└─ scripts/       루트 README 목록 생성 스크립트",
        "```",
        "",
        "새 문제가 추가된 뒤 `python3 scripts/build_readme.py`를 실행하면 아래 목록이 다시 만들어집니다.",
        "",
    ]

    for key, heading in SECTIONS:
        problems = found.get(key)
        if not problems:
            continue
        out += [f"## {heading}", "", f"총 {len(problems)}문제.", ""]

        if key == "trail1":
            groups: dict[str, list[Problem]] = {}
            for p in problems:
                groups.setdefault(p.group, []).append(p)
            for group in sorted(groups):
                out += [f"<details>", f"<summary><b>{group}</b> ({len(groups[group])}문제)</summary>", ""]
                out += render_table(groups[group], with_topic=True)
                out += ["", "</details>", ""]
        else:
            out += render_table(problems, with_topic=False)
            out += [""]

    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    found = collect()
    (ROOT / "README.md").write_text(render(found), encoding="utf-8")
    print(f"README.md 갱신 완료 ({sum(len(v) for v in found.values())}문제)")


if __name__ == "__main__":
    main()
