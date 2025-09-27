export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-probe="APPSHELL" style={{ outline: '2px dashed #888', padding: 8 }}>
      <div>APPSHELL (tek olmalı)</div>
      {children}
      {/* !!! Burada ikinci bir {children} KESİNLİKLE OLMAMALI !!! */}
    </div>
  );
}
