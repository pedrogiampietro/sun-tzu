export function ResourceCard({ image, quantity }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={image}
        alt="Resource"
        style={{ width: "30px", marginRight: "5px" }}
      />
      <span style={{ width: "30px", marginRight: "5px" }}>{quantity}</span>
    </div>
  );
}
