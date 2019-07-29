import Footer from './Footer'
import { Styles } from "./styles";
import React, {Component} from 'react'
import { Redirect, isRedirect } from "@reach/router";
import CookieConsent from "react-cookie-consent";
import Gears from "../../components/gears/Gears";
import LoadingOverlay from 'react-loading-overlay';

export const LayoutContext = React.createContext(); 

export default class Layout extends Component {
    constructor(props){
        super(props);
        this.isLoading = false;
        this.state = { 
            hasError: false, 
            isLoading: false,
            setLoadingTime: Date.now(),
        };
    }

    // please call with isLoading=false from componentDidUpdate()
    setLoading = (isLoading) => {
        if(isLoading) {
            this.setState({isLoading: isLoading, setLoadingTime: Date.now()});
            if(this.timeoutId){
                clearTimeout(this.timeoutId);
            }
        }else{
            // prevent deactivating while activation animation is still running
            let timeElapsed = Date.now() - this.state.setLoadingTime;
            this.timeoutId = setTimeout(function () {
                this.setState({isLoading: isLoading});
            }.bind(this), Math.max(50, 600-timeElapsed));
        }
    };

    componentWillUnmount () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    componentDidCatch(error, info){
        if (isRedirect(error)) {
            throw error;
        } else {
            this.setState({ hasError: true });
            console.log(error, info);
        }  
    }

    render() {
        if (this.state.hasError) {
            this.setState({ hasError: false })
            return <Redirect to={"/500"} noThrow />;
        }
        return (
            <div style={Styles.layout}>
                <LoadingOverlay
                    active={this.state.isLoading}
                    spinner={<Gears rotating={true} backgroundColor={"#fff"} />}
                    fadeSpeed={500}
                    styles={{
                        overlay: (base) => ({
                          ...base,
                          height: "100vh",
                          width: "100vw",
                          background: 'rgba(0, 0, 0, 0)',
                          transition: 'opacity 500ms ease'
                        })
                    }}
                >
                    <LayoutContext.Provider value={{setLoading: this.setLoading}}>
                        {this.props.children}
                    </LayoutContext.Provider>
                </LoadingOverlay>
                <Footer />
                <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
            </div>
        )
    }
}

Layout.contextType = LayoutContext;