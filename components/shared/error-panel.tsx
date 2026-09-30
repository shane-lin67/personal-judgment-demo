export function ErrorPanel({
  message = "数据加载失败，请稍后重试。"
}: {
  message?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">{message}</div>
  );
}
