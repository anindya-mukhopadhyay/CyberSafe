const binaryStreams = [
  '0101001101010010',
  '1110010010101001',
  '1010011100101010',
  '0011010011101100',
  '1010100101110010',
  '1101001010110011',
  '0100111001010011',
  '1001010100110101',
  '0110100111010010',
  '1100101001110101',
  '1011100101001010',
  '0111001010101100',
];

const CyberBackdrop = () => {
  return (
    <div className="cyber-backdrop" aria-hidden="true">
      <div className="cyber-grid" />
      <div className="scanline" />
      <div className="matrix-rain">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={`stream-${index}`}
            style={{
              '--x': `${index * 4.4}%`,
              '--delay': `${(index % 6) * -1.5}s`,
              '--duration': `${8 + (index % 5) * 2}s`,
            }}
          >
            {binaryStreams[index % binaryStreams.length]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CyberBackdrop;
