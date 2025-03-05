import React from "react";
import { Layout, Row, Col, Carousel, Card } from "antd";
import Cards from "../../components/Benner";
import Steps from "../../components/Steps";
import sl1 from "../../images/sl1.jpg";
import sl2 from "../../images/sl2.jpg";
import sl3 from "../../images/sl3.jpg";
import "./index.css";

const { Content } = Layout;

const Index = () => {
  return (
    <Layout className="app-container" style={{ background: "white" }}>
      <Content className="content" style={{ background: "white" }}>
        {/* ✅ Card หัวข้อด้านบน */}
        <Card className="header-card">
          <h1>องค์การบริหารส่วนจังหวัดนนทบุรี</h1>
          <h2>โครงการพัฒนา Dashboard เพื่อสนับสนุนการบริหารจัดการขยะ</h2>
        </Card>

        {/* ✅ Carousel Slide */}
        <Carousel autoplay className="carousel-container">
          <div className="carousel-slide">
            <img src={sl1} alt="Slide 1" className="carousel-image" />
          </div>
          <div className="carousel-slide">
            <img src={sl2} alt="Slide 2" className="carousel-image" />
          </div>
          <div className="carousel-slide">
            <img src={sl3} alt="Slide 3" className="carousel-image" />
          </div>
        </Carousel>

        <Row
          gutter={[16, 16]}
          justify="center"
          align="middle"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
          }}
        >
          <Col
            span={24}
            className="card-animate"
            style={{ width: "100%", maxWidth: "1200px", padding: "20px" }}
          >
            <Cards />
          </Col>

          <Col
            span={24}
            className="card-animate"
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <Steps />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Index;
