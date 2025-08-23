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
    // Activation du menu à chaque changement de route
    router.events.forEach((event) => {
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

  // Initialise le menu filtré par rôle
  initializeMenu(): void {
    this.menuItems = this.filterMenuByRoles(MENU);
    this.resetActive(this.menuItems);
  }

  // Réinitialise l'état actif
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
    return item.subItems && item.subItems.length > 0;
  }

  // Toggle menu: ferme tous les autres menus sauf celui cliqué
  toggleMenu(item: MenuItem) {
    this.menuItems.forEach(i => {
      if (i !== item) this.closeAll(i);
    });
    item.isOpen = !item.isOpen;
  }

  // Ferme le menu et tous ses sous-menus
  closeAll(item: MenuItem) {
    item.isOpen = false;
    item.isActive = false;
    if (item.subItems) item.subItems.forEach(sub => this.closeAll(sub));
  }

  // Active le menu selon la route courante
  activateMenu() {
    const currentUrl = this.router.url;

    const activateRecursively = (items: MenuItem[]): boolean => {
      let anyChildActive = false;

      items.forEach(item => {
        item.isActive = false;
        item.isOpen = false;

        let childActive = false;
        if (item.subItems) {
          childActive = activateRecursively(item.subItems);
        }

        // Vérifie si la route correspond exactement
        if (item.link && currentUrl.startsWith(item.link)) {
          item.isActive = true;
          childActive = true;
        }

        if (childActive) {
          item.isOpen = true;  // ouvre le parent
        }

        if (item.isActive || childActive) {
          anyChildActive = true;
        }
      });

      return anyChildActive;
    };

    activateRecursively(this.menuItems);
  }


  // Ouvre tous les parents du menu actif
  openParents(item: MenuItem) {
    let parent = this.findParent(item, this.menuItems);
    while (parent) {
      parent.isOpen = true; // Ouvre pour afficher le sous-menu
      parent = this.findParent(parent, this.menuItems);
    }
  }

  // Recherche récursive du parent
  findParent(child: MenuItem, items: MenuItem[]): MenuItem {
    for (let item of items) {
      if (item.subItems?.includes(child)) return item;
      if (item.subItems) {
        const found = this.findParent(child, item.subItems);
        if (found) return found;
      }
    }
    return null;
  }

  // Scroll jusqu'à l'élément actif
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
