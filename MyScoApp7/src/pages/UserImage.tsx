import { useState } from "react";

const UserImage = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="image-container">
      {loading && <div className="loader"></div>}

      <img
        src={src}
        className="user-img-circle"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default UserImage;