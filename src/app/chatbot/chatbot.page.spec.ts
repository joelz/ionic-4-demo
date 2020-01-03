import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatbotPage } from './chatbot.page';

describe('ChatbotPage', () => {
  let component: ChatbotPage;
  let fixture: ComponentFixture<ChatbotPage>;
  let listPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 10 elements', () => {
    listPage = fixture.nativeElement;
    const items = listPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });

});
