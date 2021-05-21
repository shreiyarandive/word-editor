import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import Quill from 'quill';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SetNameComponent } from '../set-name/set-name.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  docName: string;

  socket: any;
  quill: any = Quill;
  quillEditor: any;
  documentId: string;
  SAVE_INTERVAL_MS: number = 2000;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'code-block']                         // link and image, video
    ]
  };



  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.socket = io(`${environment.hostURL}`);

    this.documentId = this.activatedRoute.snapshot.params.id;

  }
  ngOnInit(): void {

    if (localStorage.getItem('new-document')) {
      this.getNameOfNewDocument();
    }

    this.createQuillEditor();

    this.socket.emit('get-document', this.documentId);

    this.loadDocument();

    this.saveDocument();

    this.receiveChanges();

    this.textChange();


  }

  docNameChange(event) {
    console.log(event);
    // TODO
    // make a connection with database and change the name for document Name
  }
  getNameOfNewDocument() {
    const dialogRef = this.dialog.open(SetNameComponent, {
      width: '400px',
      data: { docName: this.docName }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.docName = result;
      localStorage.removeItem('new-document');
    })

  }

  createQuillEditor() {
    this.quillEditor = new this.quill('#quill-editor', {
      modules: {
        toolbar: this.modules.toolbar
      },
      theme: 'snow'
    });
  }
  textChange() {
    this.quillEditor.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        this.socket.emit('send-changes', delta);
      }
    });
  }

  saveDocument() {
    setInterval(() => {
      this.socket.emit('save-document', this.quillEditor.getContents());
    }, this.SAVE_INTERVAL_MS);
  }

  loadDocument() {
    this.socket.once('load-document', document => {
      this.quillEditor.setContents(document);
    });
  }

  receiveChanges() {
    this.socket.on('receive-changes', delta => {
      this.quillEditor.updateContents(delta);
    });
  }
}
