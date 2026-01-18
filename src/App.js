import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Query의 핵심 객체(QueryClient)와
// 전역으로 쿼리 기능을 제공하는 Provider
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import HomePage from "./HomePage";

// QueryClient 인스턴스 생성
// → 서버 상태 캐시, 요청 관리, 리트라이, staleTime 등을 관리하는 "중앙 관리자"
const queryClient = new QueryClient();

function App() {
  return (
    // QueryClientProvider로 감싸면
    // 이 안에 있는 모든 컴포넌트에서 React Query 사용 가능
    <QueryClientProvider client={queryClient}>
      <HomePage />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
