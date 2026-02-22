export function InsertionLine() {
  return (
    <div
      className="insert-line"
      style={{
        height: '3px',
        background: '#f59e0b',
        borderRadius: '2px',
        margin: '0 16px',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-6px',
          top: '-4.5px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#f59e0b',
        }}
      />
    </div>
  );
}
