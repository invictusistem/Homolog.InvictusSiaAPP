import { trigger, style, state, transition, animate } 
from "@angular/animations";


export const HighlightTrigger = trigger("rowHighlight", [
    state("void", style({opacity: 0 })),  
    transition("void => *", animate("500ms")),
    state("closed", style({opacity: 0 })),  
    transition("void => *", animate("500ms"))
]);