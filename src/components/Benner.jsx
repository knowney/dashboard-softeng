import React from "react";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import { PlayCircle } from "lucide-react";
// import bannerImage from "../assets/Nott.jpg"; // เปลี่ยนเป็น path รูปจริง

const BannerWrapper = styled.div`
  background: #f0faeb; /* สีพื้นหลังอ่อน */
  padding: 50px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  text-align: left;
`;

const Title = styled.h1`
  color: #2e7d32;
  font-size: 48px;
  font-weight: bold;
  margin: 10px 0;
`;

const Subtitle = styled.p`
  color: #3e3e3e;
  font-size: 18px;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 500px;
    border-radius: 10px;
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffeb3b;
    border-radius: 50%;
    padding: 15px;
    cursor: pointer;
  }
`;

const Benner = () => {
  return (
    <BannerWrapper>
      <Row align="middle" justify="center" gutter={[32, 32]}>
        {/* ข้อความซ้าย */}
        <Col xs={24} sm={24} md={12} lg={10}>
          <ContentWrapper>
            <p style={{ color: "#6d8f64", fontWeight: "bold" }}>
              ขยะรีไซเคิลลุ้นโชค
            </p>
            <Title>แยก แลก ลุ้น</Title>
            <Subtitle>
              เพียงคุณแยกขยะรีไซเคิลแล้วบริจาคให้เรา รางวัลทองคำอาจเป็นของคุณ!
              รับสิทธิ์ลุ้นโชคตามปริมาณขยะรีไซเคิลของคุณ ลุ้นรางวัลทองคำและอื่น
              ๆ ทุกเดือน
            </Subtitle>
            <Button
              type="primary"
              size="large"
              style={{
                background: "#ffeb3b",
                color: "#000",
                border: "none",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              รีไซเคิลเลย
            </Button>
            <Button
              size="large"
              style={{
                background: "#4caf50",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
              }}
            >
              ดูจุดรับ
            </Button>
          </ContentWrapper>
        </Col>

        {/* รูปภาพขวา */}
        <Col xs={24} sm={24} md={12} lg={10}>
          <ImageWrapper>
            {/* <img src={bannerImage} alt="Recycling" /> */}
            <div className="play-button">
              <PlayCircle size={40} color="#000" />
            </div>
          </ImageWrapper>
        </Col>
      </Row>
    </BannerWrapper>
  );
};

export default Benner;
