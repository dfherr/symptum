import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CloseCircleOutline from "mdi-material-ui/CloseCircleOutline";

export class DiseaseTable extends Component {
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Disease</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.diseases.map((disease, i) => (
            <TableRow key={i}>
              <TableCell>{disease.name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => this.props.onDiseaseRemoved(disease)}
                >
                  <CloseCircleOutline fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow />
          <TableRow />
        </TableBody>
      </Table>
    );
  }
}

export default DiseaseTable;
