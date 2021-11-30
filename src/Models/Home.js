


import React, { Fragment, useEffect, useRef, useState } from 'react';
import { APP } from '../Constants/Settings';
import AutoInit from './_elem/AutoInit';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { ReactComponent as CPP }  from '../Static/Logo.svg'
import {MDCSnackbar} from '@material/snackbar';
import {MDCDialog} from '@material/dialog';
import InteractiveShell from './InteractiveShell';


function Home(props) {
    // Constants
    const webShell = useRef(null);
    const alertDelete = useRef(null);
    const [activeFile, setActiveFile] = useState(null);
    const [editorValue, setEditorValue] = useState(APP.defaultCode);
    const editor = useRef();
    const [Files, setFiles] = useState({});
    const tabList = useRef();

    // API REQUESTS
    const showConsole = function() {
        webShell.current.toggleWindow();
        webShell.current.minimizeWindow();
    }
    // Get all Files stored in localStorage
    const getAllStorage = function() {
        var archive = {}, // Notice change here
            keys = Object.keys(localStorage),
            i = keys.length;
        while ( i-- ) {
            archive[ keys[i] ] = JSON.parse(localStorage.getItem( keys[i] ));
        }
        return archive;
    }
    // Generate new empty file
    const createNewTab = function() {
        var i = 1;
        while (window.localStorage.getItem(`fichier-${i}.c`)) {
            i++;
        }
        window.localStorage.setItem(`fichier-${i}.c`,
        JSON.stringify(
            {
                content: APP.defaultCode, 
                modified: new Date()
            }
        ));
        setActiveFile(`fichier-${i}.c`);
        getFiles();
    };
    // Remove file by name
    const promptDeleteFileByName = function(name) {
        alertDelete.current.filename = name;
        alertDelete.current.MDCDialog.open();
    }
    const deleteFileByName = function(name) {
        // const keys = Object.keys(Files);
        // const index = keys.indexOf(name);
        window.localStorage.removeItem(name);
        window.throwNotification(`${name} a été supprimé.`);
        getFiles();
        // if (name === activeFile) {
            // setActiveFile(keys[index + ((index === keys.length - 1) ? -1 : 1)]);
        // }
    }
    // Get all Files stored in LocalStorage
    const getFiles = function() {
        setFiles(getAllStorage());
    };
    // Save all changes to LocalStorage
    const save = function() {
        (activeFile) && (Files[activeFile].content = editorValue);
        Object.keys(Files).forEach(key => {
            window.localStorage.setItem(key, JSON.stringify(Files[key]));
        });
        try {
            window.throwNotification(`Vos modifications ont bien été enregistrées.`);
        }catch(err){}
    };
    const changeTab = function(name) {
        // Change Appearance
        document.querySelectorAll("button[tabname].mdc-tab--active").forEach(tab => {
            tab.classList.remove("mdc-tab--active");
            tab.classList.remove("mdc-tab-indicator--active");
        });
        document.querySelectorAll(`button[tabname="${name}"]`).forEach(tab => {
            tab.classList.add("mdc-tab--active");
            tab.classList.add("mdc-tab-indicator--active");
        });
        // Change editor content
        setEditorValue(Files[name].content);
    };
    // Watch for (activeFile) changes.
    useEffect(() => {
       (activeFile) && changeTab(activeFile);
       // eslint-disable-next-line
    }, [activeFile]);
    // Watch for (Files) changes.
    useEffect(() => {
        save();
        AutoInit();
        (activeFile) && changeTab(activeFile);
        // eslint-disable-next-line
    }, [Files]);
    // Mounted()
    useEffect(() => {
        window.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        window.throwNotification = function(labelText) {
            window.snackbar.labelText = labelText;
            window.snackbar.open();
        };
        alertDelete.current.MDCDialog = new MDCDialog(alertDelete.current);
        alertDelete.current.MDCDialog.listen('MDCDialog:closing', function(event) {
            if (event.detail.action === "accept") {
                deleteFileByName(this.filename);
            }
        });
        getFiles();
        AutoInit();
        // eslint-disable-next-line
    }, []);
    return (
        <Fragment>
            <header className="mdc-top-app-bar">
                <div className="mdc-top-app-bar__row">
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                    <span className="mdc-top-app-bar__title mdc-typography--button">{APP.title}</span>
                    </section>
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                    <button className="mdc-button mdc-top-app-bar__action-item" onClick={showConsole}>
                        <span className="mdc-button__ripple"></span>
                        <span className="material-icons mdc-button__icon"> settings_ethernet</span>
                        <span className="mdc-button__label">Afficher la console </span>
                    </button>
                    <button className="mdc-button mdc-top-app-bar__action-item" onClick={save}>
                        <span className="mdc-button__ripple"></span>
                        <span className="material-icons mdc-button__icon"> save </span>
                        <span className="mdc-button__label">Enregistrer</span>
                    </button>
                    </section>
                </div>
                <div role="progressbar" className="mdc-linear-progress mdc-linear-progress--open mdc-linear-progress--indicator mdc-linear-progress--indeterminate" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
                    <div className="mdc-linear-progress__buffer">
                        <div className="mdc-linear-progress__buffer-bar"></div>
                        <div className="mdc-linear-progress__buffer-dots"></div>
                        </div>
                        <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                        <span className="mdc-linear-progress__bar-inner"></span>
                        </div>
                        <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                        <span className="mdc-linear-progress__bar-inner"></span>
                    </div>
                </div>
            </header>
            <main className="mdc-top-app-bar--fixed-adjust">
                <div className="mdc-dialog" ref={alertDelete}>
                    <div className="mdc-dialog__container">
                        <div className="mdc-dialog__surface"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="my-dialog-title"
                        aria-describedby="my-dialog-content">
                        <div className="mdc-dialog__content">
                            Êtes-vous sûr de vouloir supprimer ce fichier ?
                        </div>
                        <div className="mdc-dialog__actions">
                            <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                            <div className="mdc-button__ripple"></div>
                            <span className="mdc-button__label">Fermer</span>
                            </button>
                            <button type="button" className="mdc-button mdc-dialog__button mdc-theme--error" data-mdc-dialog-action="accept">
                            <div className="mdc-button__ripple"></div>
                            <div className="mdc-button__icon material-icons">delete_forever</div>
                            <span className="mdc-button__label">Supprimer</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="mdc-dialog__scrim"></div>
                </div>
                <div className="mdc-tab-bar" role="tablist">
                    <div className="mdc-tab-scroller" ref={tabList}>
                        <div className="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll">
                        <div className="mdc-tab-scroller__scroll-content">
                            {Object.keys(Files).map((key,i) => (
                                <Fragment key={i}>
                                    <button className="mdc-tab" role="tab" aria-selected="true" tabname={key}  onClick={() => setActiveFile(key)}>
                                        <span className="mdc-tab__content">
                                            <span className="mdc-tab__icon material-icons" aria-hidden="true">description</span>
                                            <span className="mdc-tab__text-label">{key}</span>
                                        </span>
                                        <span className="mdc-tab-indicator">
                                            <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                        </span>
                                        <span className="mdc-tab__ripple"></span>
                                    </button>
                                    <button className="mdc-theme--error mdc-icon-button material-icons" onClick={() => promptDeleteFileByName(key)} disabled={ (activeFile === key)}>
                                    <span className="mdc-icon-button__ripple"></span>
                                            clear
                                    </button>
                                </Fragment>
                            ))}
                            <button className="mdc-icon-button material-icons" onClick={createNewTab}>
                                <span className="mdc-icon-button__ripple"></span>
                                add
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            {activeFile === null ? (
               <Fragment>
                    <div className="ide--intro">         
                        <CPP />
                        <h1 className="mdc-typography--headline2">{APP.title}</h1>
                        <pre className="mdc-typography--secondary-text">
                            {APP.description}
                        </pre><br/>
                        <button className="mdc-button mdc-button--unelevated" onClick={createNewTab}>
                            <span className="mdc-button__ripple"></span>
                            <span className="mdc-button__icon material-icons">add</span>
                            <span className="mdc-button__label">Nouveau fichier</span>
                        </button>
                    </div>
                </Fragment>
            ):(<div className="cm-container">
                <CodeMirror
                    ref={editor}
                    extensions={[cpp()]}
                    theme="light"
                    value={editorValue}
                    onChange={(value) => {
                        setEditorValue(value);
                      }}
                    options={{
                        lineWrapping: true,
                        smartIndent: true,
                        lineNumbers: true,
                        foldGutter: true,
                        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                        autoCloseTags: true,
                        matchBrackets: true,
                        autoCloseBrackets: true,
                        extraKeys: {
                          'Ctrl-Space': 'autocomplete'
                        }
                      }}
                />
            </div>)}
            <InteractiveShell ref={webShell}/>
            <aside className="mdc-snackbar">
                <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
                    <div className="mdc-snackbar__label" aria-atomic="false">
                    </div>
                    <div className="mdc-snackbar__actions" aria-atomic="true">
                    <button type="button" className="mdc-button mdc-snackbar__action">
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">rejeter</span>
                    </button>
                    </div>
                </div>
            </aside>

        </main>
        </Fragment>
    );
}
export default Home;