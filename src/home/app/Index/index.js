import React from 'react';
export default class Comp extends React.Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div className="home-container">
                Welcome To My Space
            </div>
        )
    }
}