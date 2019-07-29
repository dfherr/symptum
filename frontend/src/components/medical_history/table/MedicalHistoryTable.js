import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import moment from "moment";

class MedicalHistoryTable extends React.Component {
  /**
   * Called when a disease has been removed from the table
   * (by pressing the trash can button).
   *
   * @param {*} disease
   */
  onDiseaseRemoved(disease) {
    const index = this.props.diseases.indexOf(disease);

    // Callback to parent component.
    this.props.onDiseaseRemoved(disease, index);
  }

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Disease</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.diseases.map((disease, i) => (
            <TableRow key={i}>
              <TableCell component="th">{disease.name}</TableCell>
              <TableCell>
                {(disease.active ? "since " : "on ") +
                  new moment(disease.when, "YYYY-MM-DD").format(
                    "MMMM Do, YYYY"
                  )}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => this.onDiseaseRemoved(disease)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default MedicalHistoryTable;

MedicalHistoryTable.propTypes = {
  onDiseaseRemoved: PropTypes.func.isRequired,

  diseases: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        when: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
      }.isRequired
    )
  ),
};
