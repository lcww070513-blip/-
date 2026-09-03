use std::{collections::VecDeque, io::*};

// 인덱스: 0=상, 1=우, 2=하, 3=좌 (시계 방향)
const DIR: [(isize, isize); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

fn main() {
    let input = read_to_string(stdin()).unwrap();
    let mut out = BufWriter::new(stdout());
    let mut it = input.split_whitespace().flat_map(str::parse);

    let [n, r, c, d] = [(); 4].map(|_| it.next().unwrap());
    // 입력 방향(1=상,2=하,3=좌,4=우) → DIR 인덱스(0=상,1=우,2=하,3=좌)로 매핑
    let [mut r, mut c, mut d] = [r - 1, c - 1, match d { 1 => 0, 2 => 2, 3 => 3, _ => 1 }];

    let mut map: Vec<Vec<usize>> = (0..n).map(|_| (0..n).map(|_| it.next().unwrap()).collect()).collect();

    let next = |x: usize, y: usize, d: usize| [(x as isize + DIR[d].0) as usize, (y as isize + DIR[d].1) as usize];

    'L: loop {
        map[r][c] = 2; // 방문 처리
        writeln!(out, "{} {}", r + 1, c + 1).ok();

        // 1단계: 직진(+0) → 좌회전(+3≡-1) → 우회전(+1) → 180도(+2)
        for dd in [0, 3, 1, 2] {
            let nd = (d + dd) % 4;
            let [nr, nc] = next(r, c, nd);
            if nr < n && nc < n && map[nr][nc] == 0 {
                [r, c, d] = [nr, nc, nd];
                continue 'L;
            }
        }

        // 정방향 BFS 한 번으로 "가장 가까운 미방문 칸"과
        // "그 칸에 도착하는 마지막 이동 방향"을 동시에 구한다.
        //
        // - 각 칸에서 이웃을 좌→하→우→상 순서로 검사한다.
        //   → 이 순서로 "처음 발견되는 간선"이 곧 목표 칸-BFS로 역추적했을 때와
        //     동일한 사전식 최단경로의 마지막 간선이 된다. (그래서 두 번째 BFS 불필요)
        let mut q = VecDeque::from([(r, c, 0)]);
        let mut unvisited = Vec::new();
        let mut check = vec![vec![true; n]; n];

        while let Some((i, j, dist)) = q.pop_front() {
            for d in (0..4).rev() { // 3,2,1,0 = 좌,하,우,상
                let [ni, nj] = next(i, j, d);
                if ni < n && nj < n && map[ni][nj] == 0 {
                    // 미방문 바다 발견: (거리, 좌표, 도착 방향)을 그대로 기록
                    unvisited.push([dist, ni, nj, d]);
                }
                // 미방문 후보가 하나라도 나온 뒤에는 더 깊이 확장할 필요가 없다.
                // (BFS는 레벨 순서로 처리되므로, 현재 레벨에서 이미 답이 나왔다면
                //  다음 레벨을 볼 이유가 없다 — 단, 같은 레벨의 나머지 항목은
                //  큐에 남아있는 만큼 계속 처리되어 동일 거리 후보를 다 찾는다)
                if ni < n && nj < n && map[ni][nj] == 2 && check[ni][nj] && unvisited.is_empty() {
                    check[ni][nj] = false;
                    q.push_back((ni, nj, dist + 1));
                }
            }
        }

        // (dist, 행, 열) 기준 정렬 → 최단거리 우선, 동률이면 행·열이 작은 순
        // 방향(d)은 정렬 키에 넣지 않는다: 같은 목표 칸이 여러 부모에게서
        // 발견돼도, 먼저 발견된(=우선순위 높은) 간선이 stable sort로 앞에 남는다
        unvisited.sort_by_key(|a| (a[0], a[1], a[2]));

        if let Some(&t) = unvisited.get(0) {
            [_, r, c, d] = t;
        } else {
            break;
        }
    }
}
