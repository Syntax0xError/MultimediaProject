import React, { Fragment } from "react";
import AutoInit from "./_elem/AutoInit";
import { ReactTerminal } from "react-terminal";
import { TerminalContextProvider } from "react-terminal";
import { APP } from "../Constants/Settings";
import APIRequest from '../Constants/Api';
import "../Static/interactiveShell.scss"


class InteractiveShell extends React.Component {
    constructor(props) {
        super(props);
        this.terminal = React.createRef(null);
        this.commands = {
            whoami: APP.whoami,
            about: APP.description,
            help:"(compiler, exec, enregistrer)  Fichier-i.c",
            exec: (filename) => this.handler(filename, true),
            compiler: (filename) => this.handler(filename, false)
          }
    }
    async handler(filename, exec) {
        var response = {
            status:false,
            content: null
        };
        if (/^\d+$/gsi.test(filename)){
            filename = `fichier-${filename}.c`;
        } else if (/[a-z]-\d.c/gsi.test(filename)) {
            filename = filename.replace(/(\w+-)/gsi, "fichier-")
        } else if (/fichier-\d+$/gsi.test(filename)) {
            filename = `${filename}.c`;
        }
        let file = window.localStorage.getItem(filename.toLocaleLowerCase());
        if (file) {
            file = JSON.parse(file);
            file["exec"] = exec;
            await APIRequest.post("/compile", {file:JSON.stringify(file)})
            .then((res) =>{
                response = res.data
            }).catch(err => {});
            if (response.status === true) {
                console.log(response)
                return response.stdout;
            } else {
                console.log(response)
                return response.stderr;
            }
        } else {
            return `[!] Fichier introuvable '@localStorage\\${filename}'`
        }
    }
    toggleWindow(__strict) {
        if (__strict){
            this.terminal.current.classList.remove("window--close");
        } else {
            this.terminal.current.classList.toggle("window--close");
        }
        
    }
    minimizeWindow(__strict) {
        if (__strict){
            this.terminal.current.classList.remove("window--minimize");
        } else {
            this.terminal.current.classList.toggle("window--minimize");
        }
    };
    componentDidMount() {
        AutoInit();
        
    }
    render() {
      return (
        <TerminalContextProvider>
            <div className="mdc-card mdc-card--outlined mdc-card--window window--minimize" ref={this.terminal}>
                <div className="mdc-card__appbar">
                            <div className="mdc-card__appbar--left">
                                <button className="mdc-button mdc-button--disabled">
                                    <span className="mdc-button__icon material-icons"> settings_ethernet </span>
                                    <span className="mdc-button__label">Console interactive</span>
                                </button>
                            </div>
                            <div className="mdc-card__appbar--right" onClick={() => this.minimizeWindow(false)}>
                                <button className="mdc-icon-button material-icons" aria-describedby="tooltip-minimize">
                                    <span className="mdc-icon-button__ripple"></span>
                                    minimize
                                </button>
                                <button className="mdc-icon-button material-icons" aria-describedby="tooltip-maximize">
                                    <span className="mdc-icon-button__ripple"></span>
                                    maximize
                                </button>
                                <button className="mdc-icon-button material-icons" onClick={() => this.toggleWindow(false)} aria-describedby="tooltip-close">
                                    <span className="mdc-icon-button__ripple"></span>
                                    clear
                                </button>
                            </div>
                </div>
                <div className="mdc-card__content">
                <ReactTerminal
                    showControlBar={false}
                    theme="material-light"
                    prompt={APP.prompt}
                    welcomeMessage={
                        <Fragment>
                            <p>{APP.title} [Version {APP.version}]</p>
                            <p>{APP.welcomeMessage}</p>
                        </Fragment>
                    }
                    errorMessage={<span style={{color:"var(--mdc-theme-error)"}}>[!] Commande non trouvée.</span>}
                    enableInput={true}
                    commands={this.commands}
                />
                </div>
            </div>
            <div id="tooltip-close" className="mdc-tooltip" role="tooltip" aria-hidden="true">
                <div className="mdc-tooltip__surface mdc-tooltip__surface-animation">
                    Fermer
                </div>
             </div>
             <div id="tooltip-maximize" className="mdc-tooltip" role="tooltip" aria-hidden="true">
                <div className="mdc-tooltip__surface mdc-tooltip__surface-animation">
                    Maximiser
                </div>
             </div>
             <div id="tooltip-minimize" className="mdc-tooltip" role="tooltip" aria-hidden="true">
                <div className="mdc-tooltip__surface mdc-tooltip__surface-animation">
                    Minimiser
                </div>
             </div>
            </TerminalContextProvider>
      );
    }
  }

export default InteractiveShell;