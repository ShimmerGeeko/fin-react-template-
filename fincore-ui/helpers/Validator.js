export class Validator{

    constructor(){
        this.controls = []
    }

    add(control){
        if(control.current && control.current.validate){
            
            this.controls.push(control);
        }
        else{
         //   throw "Invalid control added for validation"
        }
    }

    validate(){

        const results = []
        for (const control of this.controls) {
            console.log("Control: ", control);
            const result = control.current.validate();
            if(!result.isValid){
                results.push({field: control.current.label, errorCode: result.errorCode});
            }
        }
        return results;
    }
}