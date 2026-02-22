export function InsertionLine() {
  return (
    <div
      className="insert-line"
      style={{
        height: '2px',
        background: 'var(--foreground)',
        borderRadius: '9999px',
        margin: '0 8px',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--foreground)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--foreground)',
        }}
      />
    </div>
  );
}
