import Multiselect from "multiselect-react-dropdown";
import "./SearchForm.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Badge from 'react-bootstrap/Badge';


export const SearchForm = () => {
	const [validated, setValidated] = useState(false);
    const  [searchDetails, setSearchDetails] = useState({
        lookingForBWGender: "A",
        lookingForBWDiet: "A",
        // lookingForBWCampus: "NCR",
        lookingForBWSmokingHabit: "A",
        lookingForBWDrinkingHabit: "A",
        lookingForBWEthnicity: [],
        lookingForBWRoomPreference: "A",
    })
    const [buddyData, setBuddyData] = useState({
        fetched: false,
        data: []
    })
    const [showMatches, setShowMatches] = useState({
        show: false,
        data: []
    })

    useState(()=>{
        if(buddyData.fetched) return;
        // copied from stackoverflow -> https://stackoverflow.com/a/27979069
        const csvJSON = (csv) => {
            var lines=csv.split("\n");
            var result = [];
            var headers=lines[0].split(",");
            for(var i=1;i<lines.length;i++){
                var obj = {};
                var currentline=lines[i].split(",");
                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            return JSON.stringify(result); //JSON
          }
        fetch('https://docs.google.com/spreadsheets/d/13wTnFW3UOzIliJEMKB792XO-J4kdRHOXgCojJA8ExFg/gviz/tq?tqx=out:csv').then((d) => d.text()).then((csvData) => {
            if(buddyData.fetched) return;
            setBuddyData(prevState => ({...prevState, fetched: true, data: JSON.parse(csvJSON(csvData).replaceAll("\\\"", ""))}))
        })
    },[])



	const handleSubmit = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}
        event.preventDefault();
        if (buddyData.fetched) {
           let potentialMatches = buddyData.data.filter((v,i) => {
                if (searchDetails.lookingForBWGender !== "A") {
                    // gender filter
                    if (!((v["PERSONAL INFORMATION Gender"] === "Female" && searchDetails.lookingForBWGender === "F") ||
                        (v["PERSONAL INFORMATION Gender"] === "Male" && searchDetails.lookingForBWGender === "M") ||
                        (v["PERSONAL INFORMATION Gender"] === "Other" && searchDetails.lookingForBWGender === "O"))) {
                            return false
                        }
                }
                if (searchDetails.lookingForBWDiet !== "A") {
                    // diet filter
                    if (!((v["Dietary Preference"] === "Vegetarian" && searchDetails.lookingForBWDiet === "V") ||
                        (v["Dietary Preference"] === "Non-Vegetarian" && searchDetails.lookingForBWDiet === "N") ||
                        (v["Dietary Preference"] === "Eggitarian" && searchDetails.lookingForBWDiet === "E"))) {
                            return false
                        }
                 }
                 if (searchDetails.lookingForBWSmokingHabit !== "A") {
                    // smoker filter
                    if (!((v["Smoker"] === "No" && searchDetails.lookingForBWSmokingHabit === "N") ||
                        (v["Smoker"] === "Yes" && searchDetails.lookingForBWSmokingHabit === "Y"))) {
                            return false
                        }
                 }

                 if (searchDetails.lookingForBWDrinkingHabit !== "A") {
                    // drinker filter
                    if (!((v["Drinker"] === "No" && searchDetails.lookingForBWDrinkingHabit === "N") ||
                        (v["Drinker"] === "Yes" && searchDetails.lookingForBWDrinkingHabit === "Y"))) {
                            return false
                        }
                 }

                 if(searchDetails.lookingForBWEthnicity.length !== 0 && !searchDetails.lookingForBWEthnicity.includes("Any")) {
                    // ethnicity filter
                    if(searchDetails.lookingForBWEthnicity.includes(v["Ethnicity"]) === false) {
                        return false
                    }
                 }

                 if (searchDetails.lookingForBWRoomPreference !== "A") {
                    // bedroom preference filter
                    if (!((v["Bedroom Preference"] === "Single" && searchDetails.lookingForBWRoomPreference === "SI") ||
                        (v["Bedroom Preference"] === "Shared" && searchDetails.lookingForBWRoomPreference === "SH"))) {
                            return false
                        }
                 }

                 // if it passes all the filter
                 return true
            })
            setShowMatches((prevState) => 
              ({  ...prevState,
                show: true,
                data: potentialMatches})
            )
        }

		setValidated(true);
	};

    const ethnicities = [
        "Hindu",
        "Gujrati",
        "Madwadi",
        "Marathi",
        "Bengali",
        "Tamil",
        "Telugu",
        "Muslim",
        "Any"
    ]

	return (
		<div className="container SearchForm">
			<div className="formlbl">What type of buddy are you looking for?</div>
			<Form noValidate validated={validated} onSubmit={handleSubmit}>
				<Row className="mb-3">
					<Form.Group as={Col} md="4" controlId="validationCustom01">
						<Form.Label>Gender</Form.Label>
						<Form.Select aria-label="" value={searchDetails.lookingForBWGender} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWGender: e.target.value})))}>
							<option value="A">Any</option>
							<option value="M">Male</option>
							<option value="F">Female</option>
							<option value="O">Other</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group as={Col} md="4" controlId="validationCustom02">
						<Form.Label>Dietary Preferences</Form.Label>
                        <Form.Select aria-label="" value={searchDetails.lookingForBWDiet} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWDiet: e.target.value})))}>
							<option value="A">Any</option>
							<option value="V">Vegeterian</option>
							<option value="N">Non-Vegeterian</option>
							<option value="E">Eggeterian</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
         {/* We're do not have campus locations in form */}
                    {/* <Form.Group as={Col} md="4" controlId="validationCustom03">
						<Form.Label>Campus Location</Form.Label>
                        <Form.Select aria-label="" value={searchDetails.lookingForBWCampus} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWCampus: e.target.value})))} required>
							<option disabled="disabled">Choose one</option>
							<option value="NCR">Nation Capital Region (DC AREA)</option>
							<option value="NVC">North Virginia Centre</option>
							<option value="BLB">Blacksburg (Main Campus)</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group> */}
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
						<Form.Label>Smoking Habit?</Form.Label>
                        <Form.Select aria-label="" value={searchDetails.lookingForBWSmokingHabit} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWSmokingHabit: e.target.value})))} required>
							<option value="A">I don't mind, either is fine</option>
							<option value="Y">Yes</option>
							<option value="N">No</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom04">
						<Form.Label>Drinking Habit?</Form.Label>
                        <Form.Select aria-label="" value={searchDetails.lookingForBWDrinkingHabit} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWDrinkingHabit: e.target.value})))} required>
							<option value="A">I don't mind, either is fine</option>
							<option value="Y">Yes</option>
							<option value="N">No</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
                    <Form.Group as={Col}  controlId="validationCustom05">
						<Form.Label>Ethnicity of your roommate</Form.Label>
                            <Multiselect style={{chips: {background: "#861F41"}, option: {background: "#861F41", color: "white"}}} showArrow options={ethnicities} isObject={false} onSelect={(e) => setSearchDetails((prevState) => ({...prevState, lookingForBWEthnicity: e}))}  onRemove={(e) => setSearchDetails((prevState) => ({...prevState, lookingForBWEthnicity: e}))}/>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
                    <Form.Group as={Col} md="12" controlId="validationCustom06">
						<Form.Label>Bedroom Preference</Form.Label>
                        <Form.Select aria-label="" value={searchDetails.lookingForBWRoomPreference} onChange={(e => setSearchDetails((prevState) => ({...prevState, lookingForBWRoomPreference: e.target.value})))} required>
							<option value="A">I don't mind, either is fine</option>
							<option value="SI">Single</option>
							<option value="SH">Shared</option>
						</Form.Select>
						<Form.Control.Feedback>
							Looks good!
						</Form.Control.Feedback>
					</Form.Group>
				</Row>
				<Button style={{background: "#861F41"}} type="submit">Search for buddies</Button>
			</Form>

            {showMatches.show ? <div className="matches row">
              <h3>  <center>Results:</center></h3>
                    {showMatches.data.length === 0 ? 'No Buddies Found' : showMatches.data.map((v,i)=> {
                        return   <div class="col-sm-6" key={i}>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between"> <span>{v.Name}</span><Badge bg={v["PERSONAL INFORMATION Gender"] === "Female" ? "success" : (v["PERSONAL INFORMATION Gender"] === "Male" ? "primary" : "info")}>{v["Age"] + ' ' + v["PERSONAL INFORMATION Gender"]}</Badge></h5>
                            <div className="card-text d-flex justify-content-between flex-column align-items-start">
                                <span>Current Student: <b className="ans">{v['Are you a current Student?']}</b></span>
                                <span>Preferred Ethnicity for roommate <b className="ans">{v['ROOMMATE PREFERENCE Ethnicity']}</b></span>
                                <span>Expected Move-In Date: <b className="ans">{v['Expected Move-In Date']}</b></span>
                                <span>VT Email ID: <b className="ans"><a href={v['VT Email ID'] ? "mailto:"+v['VT Email ID'] : ''}>{v['VT Email ID'] ? v['VT Email ID'] : 'Not Submitted'}</a></b></span>
                                <span>Personal Email ID: <b className="ans"><a href={v['CONTACT DETAILS Personal Email ID'] ? "mailto:"+v['CONTACT DETAILS Personal Email ID'] : ''}>{v['CONTACT DETAILS Personal Email ID'] ? v['CONTACT DETAILS Personal Email ID'] : 'Not Submitted'}</a></b></span>
                                <span>WhatsApp Number: <b className="ans"><a href={v['WhatsApp Number'] ? "tel:"+v['WhatsApp Number'] : ''}>{v['WhatsApp Number'] ? v['WhatsApp Number'] : 'Not Submitted'}</a></b></span>
                                <span>Calling Number: <b className="ans"><a href={v['Calling Number'] ? "tel:"+v['Calling Number'] : ''}>{v['Calling Number'] ? v['Calling Number'] : 'Not Submitted'}</a></b></span>
                                <span>Expected Rent: <b className="ans">{v['LOOKING FOR AN APARTMENT Expected Rent'] ? v['LOOKING FOR AN APARTMENT Expected Rent'] : 'Not Submitted'}</b></span>
                                <span>Bedroom Preferences: <b className="ans">{v['Bedroom Preference'] ? v['Bedroom Preference'] : 'Not Submitted'}</b></span>
                                <span>Smoker: <b className="ans">{v['Smoker'] ? v['Smoker'] : 'Not Submitted'}</b></span>
                                <span>Drinker: <b className="ans">{v['Drinker'] ? v['Drinker'] : 'Not Submitted'}</b></span>
                                <span>Already Booked an Apartment?: <b className="ans">{v['Have you booked an Apartment?'] ? v['Have you booked an Apartment?'] : 'Not Submitted'}</b></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    })}
            </div> : ''}
		</div>
	);
};
