import React from "react";
import Navbar from "../Navbar/Navbar";
import DrugItem from "../Drug Item/DrugItem";
import DrugModal from "../Drug Modal/DrugModal";
import DiseaseItem from "../DiseaseItem/DiseaseItem";

const drugs = [
  {
    imageUrl: "https://www.agcnigeria.org/images/blogdetails/48.jpg",
    name: "Paracetamol 500mg",
    price: "100 €",
  },
  {
    imageUrl: "https://www.agcnigeria.org/images/blogdetails/48.jpg",
    name: "Paracetamol 500mg",
    price: "100 €",
  },
  {
    imageUrl: "https://www.agcnigeria.org/images/blogdetails/48.jpg",
    name: "Paracetamol 500mg",
    price: "100 €",
  },
  {
    imageUrl: "https://www.agcnigeria.org/images/blogdetails/48.jpg",
    name: "Paracetamol 500mg",
    price: "100 €",
  },
  {
    imageUrl: "https://www.agcnigeria.org/images/blogdetails/48.jpg",
    name: "Paracetamol 500mg",
    price: "100 €",
  },
];

class Test extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <DrugItem
            imageUrl="https://www.agcnigeria.org/images/blogdetails/48.jpg"
            title="Paracetamol 500mg"
            content="100 €"
          />
          <br />
          <DiseaseItem />
          <br />
          <DrugModal drugs={drugs} />
        </div>
      </div>
    );
  }
}

export default Test;
