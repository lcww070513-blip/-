import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="state" style={{ marginTop: 40 }}>
      <div className="state-icon">
        <Icon.Alert size={34} />
      </div>
      <h3>페이지를 찾을 수 없습니다</h3>
      <p>주소가 잘못되었거나 이동된 페이지입니다. 아래에서 원하는 곳으로 이동하세요.</p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Icon.Home /> 홈으로
        </Link>
        <Link to="/basics" className="btn">
          반도체 기초
        </Link>
        <Link to="/interview" className="btn">
          면접 준비
        </Link>
        <Link to="/quiz" className="btn">
          문제은행
        </Link>
      </div>
    </div>
  );
}
