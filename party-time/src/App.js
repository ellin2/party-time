import React from "react";
import config from "./config";
import Firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from '@mui/x-data-grid';


class App extends React.Component {
    constructor(props) {
        super(props);
        Firebase.initializeApp(config);
        this.updateType = this.updateType.bind(this);
        this.name = React.createRef();
        this.dish = React.createRef();
        this.state = {
            attendees: [],
            id: '',
            type: '',
            buttonText: 'RSVP',
        };
    }

    componentDidMount() {
        this.getUserData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            this.writeUserData();
        }
    }

    writeUserData = () => {
        Firebase.database()
            .ref("/")
            .set(this.state);
    }

    getUserData = () => {
        let ref = Firebase.database().ref("/");
        ref.on("value", snapshot => {
            const state = snapshot.val();
            this.setState(state);
        });
    }

    updateType = (option) => {
        this.setState({type: option.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        const {type, id, attendees} = this.state;
        let name = capitalize(this.name.current.value);
        let dish = capitalize(this.dish.current.value);
        if (name && dish && type) {
            let attendee = {};
            if (id && attendees.length > 0) {
                const index = attendees.findIndex(data => {
                    return data.id === id;
                });
                if (index !== -1) {
                    attendee = attendees[index];
                    attendees[index].name = name;
                    attendees[index].dish = dish;
                    attendees[index].type = type;
                    console.log('Updated');
                }
            } else {
                const id = new Date().getTime().toString();
                attendee = {id, name, dish, type};
                attendees.push(attendee);
                console.log('Saved');
            }
            this.setState({attendees});
            console.log(`Attendee: ${JSON.stringify(attendee)}`);
            this.clearForm();
            window.alert('Thanks for signing up! See you soon :)');
            window.location.replace("/#sign-up-list");
        } else {
            window.alert('Please complete all fields.');
        }
    }

    clearForm = () => {
        this.setState({buttonText: "RSVP", type: "", id: ""});
        this.name.current.value = "";
        this.dish.current.value = "";
    }

    removeAttendee = attendee => {
        const {attendees} = this.state;
        const newState = attendees.filter(data => {
            return data.id !== attendee.id;
        });
        this.setState({attendees: newState});
        this.clearForm();
        console.log('Removed Attendee');
    }

    updateData = (attendee) => {
        this.setState({buttonText: "Update"});
        window.location.replace("/#welcome");
        this.name.current.value = attendee.name;
        this.dish.current.value = attendee.dish;
        this.setState({type: attendee.type, id: attendee.id});
    }

    partyInfo = () => {
        return (
            <div className="row">
                <div id="sign-up-list">
                    <h3>Sign Up List</h3>
                    {this.dataTable()}
                </div>
            </div>
        )
    }

    tableButtons = (attendee) => {
        return (
            <div>
                <button
                    onClick={() => this.updateData(attendee)}
                    className="btn btn-primary"
                    style={{
                        backgroundColor: "darkOrange",
                        borderColor: "darkOrange",
                    }}
                >
                    Edit
                </button>
                <button
                    onClick={() => this.removeAttendee(attendee)}
                    className="btn btn-primary"
                    style={{
                        backgroundColor: "darkOrange",
                        borderColor: "darkOrange",
                        marginLeft: "5px"
                    }}
                >
                    Remove
                </button>
            </div>
        );
    }

    dataTable = () => {
        const columns = [
            {
                field: 'name', headerName: 'Name', width: 275,
                renderCell: ({value}) => (
                    <span style={{
                        overflowY: "auto",
                        height: "calc(100% + 2%)",
                        whiteSpace: "normal",
                        textAlign: "left",
                        marginTop: "30px",
                    }}>
                {value}
            </span>
                )
            },
            {
                field: 'dish', headerName: 'Dish', width: 275,
                renderCell: ({value}) => (
                    <span style={{
                        overflowY: "auto",
                        height: "calc(100% + 2%)",
                        whiteSpace: "normal",
                        textAlign: "left",
                        marginTop: "30px",
                    }}>
                {value}
            </span>
                )
            },
            {
                field: 'type', headerName: 'Type', width: 100,
                renderCell: ({value}) => (
                    <span style={{
                        height: "calc(100% + 2%)",
                        textAlign: "left",
                        marginTop: "30px",
                    }}>
                {value}
            </span>
                )
            },
            {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                width: 160,
                renderCell: (params) => {
                    const attendee = params.row;
                    return this.tableButtons(attendee);
                }
            },
        ];
        const rows = JSON.parse(JSON.stringify(this.state.attendees));
        return (
            <div>
                <DataGrid
                    style={{
                        height: 386,
                        width: "90%",
                        maxWidth: 820,
                        backgroundColor: "white",
                        borderRadius: "10px",
                        margin: "auto",
                    }}
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    allowTextWrap={true}
                />
            </div>
        );
    }

    selectMenu() {
        return (
            <div className="form-group col-md-6" style={{margin: "auto"}}>
                <label>Type*</label>
                <FormControl fullWidth>
                    {this.state.type === "" ? (
                        <InputLabel shrink={false} id='type_label'>
                            Type
                        </InputLabel>
                    ) : null}
                    <Select
                        id="type-select"
                        value={this.state.type}
                        onChange={this.updateType}
                        style={{backgroundColor: "white", borderRadius: "7px"}}
                    >
                        <MenuItem value="Appetizer">Appetizer</MenuItem>
                        <MenuItem value="Main">Main</MenuItem>
                        <MenuItem value="Side">Side</MenuItem>
                        <MenuItem value="Dessert">Dessert</MenuItem>
                    </Select>
                </FormControl>
            </div>
        )
    }

    dishInput() {
        return (
            <div className="form-group col-md-6" style={{margin: "auto"}}>
                <label>Dish*</label>
                <input
                    type="text"
                    ref={this.dish}
                    className="form-control"
                    placeholder="Dish"
                />
            </div>
        )
    }

    nameInput() {
        return (
            <div className="form-group col-md-6" style={{margin: "auto"}}>
                <label>Name*</label>
                <input
                    type="text"
                    ref={this.name}
                    className="form-control"
                    placeholder="Name"
                />
            </div>
        )
    }

    form() {
        return (
            <div className="row" id="form" style={{margin: "auto", width: "90%", maxWidth: 820}}>
                <div className="col-xl-12">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row" id="form">
                            {this.nameInput()}
                            {this.dishInput()}
                            {this.selectMenu()}
                        </div>
                        {submitButton(this.state.buttonText)}
                    </form>
                </div>
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className="container"
                     style={{
                         backgroundColor: "orange",
                         minHeight: "100vh",
                         minWidth: "100vw",
                         color: "lightYellow",
                         textAlign: "center",
                     }}>
                    {header()}
                    {this.form()}
                    {(this.state.attendees.length > 0) ? this.partyInfo() : null}
                    {(this.state.attendees.length > 0) ? toTopButton() : null}
                </div>
            </React.Fragment>
        );
    }
}

function header() {
    return (
        <div className="row" id="welcome">
            <div className="col-xl-12" style={{marginTop: "15px"}}>
                <h1>Holiday Potluck</h1>
                <h3>Tell us what you're bringing!</h3>
            </div>
        </div>
    )
}

function capitalize(input) {
  if (!!input) {
    let firstLetter = input[0].toUpperCase();
    return firstLetter + input.substr(1,);
  }
}

function submitButton(text) {
    return (
        <button type="submit" className="btn btn-primary"
                style={{
                    backgroundColor:"darkOrange",
                    borderColor:"orange",
                    marginTop:"15px",
                    marginBottom:"25px"
                }}>
            {text}
        </button>
    )
}

function toTopButton() {
    return (
        <button
            onClick={() => {window.location.replace("/#welcome");}}
            className="btn btn-primary"
            style={{
                backgroundColor:"darkOrange",
                borderColor:"darkOrange",
                margin:"15px"
            }}>
            Back to Top
        </button>
    )
}

export default App;