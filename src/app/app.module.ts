import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { DesnityGraphComponent } from './desnity-graph/desnity-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    ScatterplotComponent,
    DesnityGraphComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
