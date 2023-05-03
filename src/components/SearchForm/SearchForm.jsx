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

            const getJSONfromTSV = (tsv) => {
                let tmpTsv = tsv.split('\n');
                delete tmpTsv[0];
                let _tsvToProcess = tmpTsv.join('\n').slice(1);
                const tsv2arr = (tsv) => {
                    const [headers, ...rows] = tsv.trim().split('\n').map (r => r.split ('\t'))
                    return rows.reduce ((a, r) => [
                      ...a, 
                      Object.assign (...(r.map (
                        (x, i, _, c = x.trim()) => {
                            if (headers[i].trim() === "VT Email ID") return  {[headers[i].trim()]: c?.trim() ? c : _[14] }
                            else if (headers[i].trim() === "Program") return  {[headers[i].trim()]: c?.trim() ? c : _[13] }
                            else return {[headers[i].trim() + i]: isNaN(c) ? c : Number(c) }
                    }
                      )))
                    ], [])
                  }
                return tsv2arr(_tsvToProcess)
            }

        fetch(`https://docs.google.com/spreadsheets/d/13wTnFW3UOzIliJEMKB792XO-J4kdRHOXgCojJA8ExFg/export?format=tsv`).then((d) => d.text()).then((tsvData) => {
            if(buddyData.fetched) return;
            setBuddyData(prevState => ({...prevState, fetched: true, data: getJSONfromTSV(tsvData)}))
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
                    if (!((v["Gender3"] === "Female" && searchDetails.lookingForBWGender === "F") ||
                        (v["Gender3"] === "Male" && searchDetails.lookingForBWGender === "M") ||
                        (v["Gender3"] === "Other" && searchDetails.lookingForBWGender === "O"))) {
                            return false
                        }
                }
                if (searchDetails.lookingForBWDiet !== "A") {
                    // diet filter
                    if (!((v["Dietary Preference8"] === "Vegetarian" && searchDetails.lookingForBWDiet === "V") ||
                        (v["Dietary Preference8"] === "Non-Vegetarian" && searchDetails.lookingForBWDiet === "N") ||
                        (v["Dietary Preference8"] === "Eggitarian" && searchDetails.lookingForBWDiet === "E"))) {
                            return false
                        }
                 }
                 if (searchDetails.lookingForBWSmokingHabit !== "A") {
                    // smoker filter
                    if (!((v["Smoker9"] === "No" && searchDetails.lookingForBWSmokingHabit === "N") ||
                        (v["Smoker9"] === "Yes" && searchDetails.lookingForBWSmokingHabit === "Y"))) {
                            return false
                        }
                 }

                 if (searchDetails.lookingForBWDrinkingHabit !== "A") {
                    // drinker filter
                    if (!((v["Drinker10"] === "No" && searchDetails.lookingForBWDrinkingHabit === "N") ||
                        (v["Drinker10"] === "Yes" && searchDetails.lookingForBWDrinkingHabit === "Y"))) {
                            return false
                        }
                 }

                 if(searchDetails.lookingForBWEthnicity.length !== 0 && !searchDetails.lookingForBWEthnicity.includes("Any")) {
                    // ethnicity filter
                    if(searchDetails.lookingForBWEthnicity.includes(v["Ethnicity6"]) === false) {
                        return false
                    }
                 }

                 if (searchDetails.lookingForBWRoomPreference !== "A") {
                    // bedroom preference filter
                    if (!((v["Bedroom Preference24"] === "Single" && searchDetails.lookingForBWRoomPreference === "SI") ||
                        (v["Bedroom Preference24"] === "Shared" && searchDetails.lookingForBWRoomPreference === "SH"))) {
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
              <h3>  <center>Results ({showMatches.data.length} Found):</center></h3>
                    {showMatches.data.length === 0 ? 'No Buddies Found' : showMatches.data.map((v,i)=> {
                        return   <div className="col-sm-6" key={i}>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between"> <span>{v['Name2']}</span><Badge bg={v["Gender3"] === "Female" ? "success" : (v["Gender3"] === "Male" ? "primary" : "info")}>{v["Age5"] + ' ' + v["Gender3"]}</Badge></h5>
                            <div className="card-text d-flex justify-content-between flex-column align-items-start">
                                <span>Current Student: <b className="ans">{v['Are you a current Student?11']}</b></span>
                                <span>Ethnicity: <b className="ans">{v['Ethnicity6']}</b></span>
                                <span>Program: <b className="ans">{v['Program'] ? v['Program'] : 'Not Submitted'}</b></span>
                                <span>Expected Move-In Date: <b className="ans">{v['Expected Move-In Date25']}</b></span>
                                <span>VT Email ID: <b className="ans"><a href={v['VT Email ID'] ? "mailto:"+v['VT Email ID'] : ''}>{v['VT Email ID'] ? v['VT Email ID'] : 'Not Submitted'}</a></b></span>
                                <span>Personal Email ID: <b className="ans"><a href={v['Personal Email ID34'] ? "mailto:"+v['Personal Email ID34'] : ''}>{v['Personal Email ID34'] ? v['Personal Email ID34'] : 'Not Submitted'}</a></b></span>
                                <span>WhatsApp Number: <b className="ans"><a href={v['WhatsApp Number35'] ? "tel:"+v['WhatsApp Number35'] : ''}>{v['WhatsApp Number35'] ? v['WhatsApp Number35'] : 'Not Submitted'}</a></b></span>
                                <span>Calling Number: <b className="ans"><a href={v['Calling Number36'] ? "tel:"+v['Calling Number36'] : ''}>{v['Calling Number36'] ? v['Calling Number36'] : 'Not Submitted'}</a></b></span>
                                <span>Expected Rent: <b className="ans">{v['Expected Rent23'] ? v['Expected Rent23'] : 'Not Submitted'}</b></span>
                                <span>Already Booked an Apartment?: <b className="ans">{v['Have you booked an Apartment?22'] ? v['Have you booked an Apartment?22'] : 'Not Submitted'}</b></span>
                                <div className="red-box d-flex justify-content-between flex-column align-items-start">
                                    <center className="text-center text-danger">Looking for a buddy with:</center>
                                    <span>Ethnicity: <b className="ans">{v['Ethnicity18']}</b></span>
                                    <span>Dietary Preferance: <b className="ans">{v['Dietary Preference19']}</b></span>
                                    <span>Smoker: <b className="ans">{v['Smoker20'] ? v['Smoker20'] : 'Not Submitted'}</b></span>
                                    <span>Drinker: <b className="ans">{v['Drinker21'] ? v['Drinker21'] : 'Not Submitted'}</b></span>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    })}
            </div> : ''}
		</div>
	);
};
