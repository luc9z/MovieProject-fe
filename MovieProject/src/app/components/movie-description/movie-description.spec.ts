import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDescription } from './movie-description';

describe('MovieDescription', () => {
  let component: MovieDescription;
  let fixture: ComponentFixture<MovieDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
