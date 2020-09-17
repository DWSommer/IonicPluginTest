import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {jsPDF, jsPDFOptions} from 'jspdf';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private filePath: FilePath, private imagePicker: ImagePicker, private file: File, private fileOpener: FileOpener) { }
  @ViewChild('htmlData') htmlData: ElementRef;
  public folder: string;

  USERS = [
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'sincere@april.biz',
      phone: '1-770-736-8031 x56442'
    },
    {
      id: 2,
      name: 'Ervin Howell',
      email: 'shanna@melissa.tv',
      phone: '010-692-6593 x09125'
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      email: 'nathan@yesenia.net',
      phone: '1-463-123-4447',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      email: 'julianne@kory.org',
      phone: '493-170-9623 x156'
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      email: 'lucio@annie.ca',
      phone: '(254)954-1289'
    },
    {
      id: 6,
      name: 'Mrs. Dennis',
      email: 'karley@jasper.info',
      phone: '1-477-935-8478 x6430'
    }
  ];

  options = {
    // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
    // selection of a single image, the plugin will return it.
    maximumImagesCount: 10,
    // output type, defaults to FILE_URIs.
    // available options are
    // window.imagePicker.OutputType.FILE_URI (0) or
    // window.imagePicker.OutputType.BASE64_STRING (1)
    outputType: 0
  };

  headers = this.createHeaders([
    'id',
    'coin',
    'game_group',
    'game_name',
    'game_version',
    'machine',
    'vlt'
  ]);

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  doImagePicking(){
    this.imagePicker.getPictures(this.options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        console.log('Image URI ' + i + ': ' + results[i]);
        this.filePath.resolveNativePath(results[i]).then(filePath => {
          console.log('-Dateipfad-' + filePath);
        })
            .catch(e => console.log(e));
      }
    }, (err) => {
      console.log(err);
    });
  }


  doPDF() {
    const fileName = 'TestDataCellAndJPG.pdf';
    const directory = this.file.externalRootDirectory + '/Download/' + fileName;
    this.fileOpener.showOpenWithDialog(directory, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));

  }
   generateData(amount) {
     const result = [];
     const data = {
       coin: '100',
       game_group: 'GameGroup',
       game_name: 'XPTO2',
       game_version: '25',
       machine: '20485861',
       vlt: '0',
       id: ''
     };
     for (let i = 0; i < amount; i += 1) {
      data.id = (i + 1).toString();
      result.push(Object.assign({}, data));
    }
     return result;
  }

  createHeaders(keys) {
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: 'center',
        padding: 0
      });
    }
    return result;
  }
  downloadPDF(){
    let doc: jsPDF;
    // const options: jsPDFOptions = {}; // = {putOnlyUsedFonts: true, orientation: 'landscape'};
    // options.orientation = 'l';
    doc = new jsPDF({orientation: 'l'});
    doc.text('Aufmaßbericht', 20, 20);
    // doc.save('table.pdf');
    doc.table(20, 20, this.generateData(15), this.headers, { autoSize: true });
    doc.addPage();
    this.file.readAsDataURL(this.file.externalRootDirectory + '/DCIM/', 'ett.jpg').then(txt_dataURL => {
      console.log('Datei Test = ' + txt_dataURL);
      doc.addImage(txt_dataURL, 1, 1, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
      const pdfOutput = doc.output();

      const buffer = new ArrayBuffer(pdfOutput.length);

      const array = new Uint8Array(buffer);

      for (let i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }

// For this, you have to use ionic native file plugin
      const directory = this.file.externalRootDirectory + '/Download/';

      const fileName = 'TestDataCellAndJPG.pdf';
      console.log('----Alive----'  + directory);
      this.file.writeFile(directory, fileName, buffer)
          .then((success) => console.log('File created Succesfully' + JSON.stringify(success)))
          .catch((error) => console.log('Cannot Create File ' + JSON.stringify(error)));
    });
}
}




// doFileChoosing() {
//   this.fileChooser.open()
//       .then(uri => {
//         console.log(uri);
//         this.filePath.resolveNativePath(uri).then(filePath => {
//           console.log('-Dateipfad-' + filePath);
//         })
//             .catch(e => console.log(e));
//       })
//       .catch(e => console.log(e));
// }
