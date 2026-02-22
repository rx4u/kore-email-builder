export function InsertionLine() {
  return (
    <div
      style={{
        height: '2px',
        background: '#f59e0b',
        borderRadius: '1px',
        margin: '0 16px',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-5px',
          top: '-4px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#f59e0b',
        }}
      />
    </div>
  );
}
