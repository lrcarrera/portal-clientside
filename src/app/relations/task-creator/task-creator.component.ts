import {Component,Inject,Input,OnInit,ViewChild} from '@angular/core';
import {ErrorStateMatcher,MAT_DIALOG_DATA,MatDialogRef,MatRadioGroup} from '@angular/material';
import {FormControl,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {AdvisorService} from '../../services/advisor/advisor.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

enum TaskCreatorTypes {
  TASK = 'task',
  CAMPAIGN = 'campaign',
  DOCUMENT = 'document'
}

enum RelationsGroup {
  ECONOMICAL = 'economical',
  FAMILIAR = 'familiar',
}

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss']
})

export class TaskCreatorComponent {

  activityControl = new FormControl('',[
    Validators.required,
  ]);
  activities: string[] = [TaskCreatorTypes.TASK,TaskCreatorTypes.CAMPAIGN,TaskCreatorTypes.DOCUMENT];
  descriptionControl = new FormControl('',[
    Validators.required,
    Validators.minLength(10)
  ]);

  matcher = new MyErrorStateMatcher();

  dni: string;
  errors: string;
  accounts: any;
  accountsToComboBox: any = [];

  @ViewChild('group')
  group: MatRadioGroup;
  @Input()
  required: Boolean;


  constructor(
    private dialogRef: MatDialogRef<TaskCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data,private advisorService: AdvisorService) {
    this.dni = data.dni;
  }

  public createTask() {
    let requestData = this.buildRequestDataProfileCustomer();

    this.advisorService.createTaskFromAdvisor(this.dni, requestData).subscribe(result => {
         this.dialogRef.close({refresh: true});
       },
       error => {
         this.errors = error;
       }
     );
  }

  private buildRequestDataProfileCustomer() {
    let body;
    body = this.group.value === RelationsGroup.ECONOMICAL ? 'economical_group' : 'familiar_group';
    if (this.activityControl.value === TaskCreatorTypes.TASK) {
      return {
        [body] : {
          tasks: 1
        }
      };
    } else if (this.activityControl.value === TaskCreatorTypes.CAMPAIGN) {
      return {
        [body] : {
          campaigns: 1
        }
      };
    } else {
      return {
        [body] : {
          documents: 1
        }
      };
    }
  }
}

