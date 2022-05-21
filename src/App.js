import './App.css';
import Main from "./components/MainComponent";
import 'bootstrap/dist/css/bootstrap.css'
import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";

const store = ConfigureStore()

class App extends Component{
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Main/>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }

}

export default App;
