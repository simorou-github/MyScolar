import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges, ElementRef } from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('sideMenu') sideMenu: ElementRef;
  @ViewChild('componentRef') scrollRef;
  @Input() isCondensed = false;

  menuItems: MenuItem[] = [];
  roles: string[] = [];
  menu: any;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    public translate: TranslateService
  ) {
    // écoute changement de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
        this.scrollToActive();
      }
    });
  }

  ngOnInit() {
    this.roles = this.tokenService.getRoles || [];
    this.initializeMenu();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this.activateMenu();
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  // init menu filtré par rôle
  initializeMenu(): void {
    this.menuItems = this.filterMenuByRoles(MENU);
    this.resetActive(this.menuItems);
  }

  resetActive(items: MenuItem[]) {
    items.forEach(item => {
      item.isActive = false;
      item.isOpen = false;
      if (item.subItems) this.resetActive(item.subItems);
    });
  }

  filterMenuByRoles(menuItems: MenuItem[]): MenuItem[] {
    const userRoles = this.roles;
    if (!userRoles || userRoles.length === 0) return [];

    return menuItems.reduce((acc, item) => {
      if (item.isTitle) {
        acc.push(item);
        return acc;
      }

      const isAllowed = userRoles.some(role => item.rolesAllowed?.includes(role));
      if (item.subItems) {
        const filteredSubItems = this.filterMenuByRoles(item.subItems);
        if (filteredSubItems.length > 0) {
          acc.push({ ...item, subItems: filteredSubItems });
        }
      } else if (isAllowed) {
        acc.push(item);
      }

      return acc;
    }, [] as MenuItem[]);
  }

  hasItems(item: MenuItem): boolean {
    return !!item.subItems && item.subItems.length > 0;
  }

  toggleMenu(item: MenuItem) {
    this.menuItems.forEach(i => {
      if (i !== item) this.closeAll(i);
    });
    item.isOpen = !item.isOpen;
  }

  closeAll(item: MenuItem) {
    item.isOpen = false;
    item.isActive = false;
    if (item.subItems) item.subItems.forEach(sub => this.closeAll(sub));
  }

  /**
   * Active menu en fonction de la route
   */
  activateMenu() {
    const currentUrl = this.router.url.split('?')[0]; // enlève query params

    const activateRecursively = (items: MenuItem[]): boolean => {
      let anyChildActive = false;

      items.forEach(item => {
        // reset
        item.isActive = false;
        item.isOpen = false;

        let childActive = false;
        if (item.subItems) {
          childActive = activateRecursively(item.subItems);
        }

        // match exact
        if (item.link && currentUrl === item.link) {
          item.isActive = true;
          anyChildActive = true;
        }

        // si un enfant est actif => parent actif + ouvert
        if (childActive) {
          item.isActive = true;
          item.isOpen = true;
          anyChildActive = true;
        }
      });

      return anyChildActive;
    };

    activateRecursively(this.menuItems);
  }

  scrollToActive() {
    setTimeout(() => {
      const activeEl = document.querySelector('.mm-active, .active');
      if (activeEl && this.scrollRef && this.scrollRef.SimpleBar !== null) {
        const offsetTop = (activeEl as HTMLElement).offsetTop;
        if (offsetTop > 300) {
          this.scrollRef.SimpleBar.getScrollElement().scrollTop = offsetTop - 100;
        }
      }
    }, 300);
  }
}
