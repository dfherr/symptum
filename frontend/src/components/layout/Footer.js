import React, {Component} from 'react'
import { Styles } from "./styles";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from '@reach/router';

export default class Footer extends Component {
  render() {
      return (
          <footer style={Styles.footer}>
          <Container>
            <Divider style={Styles.divider}/>
            <Container style={Styles.footerList}>
                <Typography style={Styles.links} variant="body2" color="textSecondary" align="center">
                    {'Built with love by Team 6'}
                </Typography>
                <Link component={RouterLink} to="/privacy_policy">
                    <Button style={Styles.links}>
                        Privacy Policy
                    </Button>
                </Link>
                <Link component={RouterLink} to="/contact">
                    <Button style={Styles.links}>
                        Contact
                    </Button>
                </Link>
            </Container>

          </Container>
          </footer>
      )
  }
}