import React from 'react';
import { Styles } from './styles';
import DrugItem from '../drug_item/DrugItem';

/**
 * Props: drugs : Array of drugs ({imageUrl, name, price})
 */
class DrugList extends React.Component {

  renderDrugList = () => {
    return (
      <div style={Styles.container}>
        {this.props.drugs.map(drug => (
          <div key={drug.id} style={Styles.drugContainer}> 
            <DrugItem drug = {drug}
            />
          </div> 
        ))}
      </div>
    );
  }

  renderNoDrugs = () => {
    if (this.props.drugs.length === 0) {
      return <div>No suggested drugs</div>
    }
  }


  render() {
    return (
      <div style={Styles.container}>
       {this.renderDrugList()}
       {this.renderNoDrugs()}
      </div>
    );
  }
}

export default DrugList;
