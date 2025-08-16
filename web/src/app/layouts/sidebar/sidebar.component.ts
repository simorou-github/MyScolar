import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import MetisMenu from 'metismenujs';
import { EventService } from '../../core/services/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from 'src/app/shared/authentication/token.service';

import { HttpClient } from '@angular/common/http';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Composant de la barre latérale
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef;
  @Input() isCondensed = false;
  menu: any;

  menuItems: MenuItem[] = [];
  roles: string[] = [];

  @ViewChild('sideMenu') sideMenu: ElementRef;

  constructor(
    private eventService: EventService,
    private tokenService: TokenService,
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit() {
    this.roles = this.tokenService.getRoles;
    this.initialize();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
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

  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0]['offsetTop'];
        if (currentPosition > 500 && this.scrollRef && this.scrollRef.SimpleBar !== null) {
          this.scrollRef.SimpleBar.getScrollElement().scrollTop = currentPosition + 300;
        }
      }
    }, 300);
  }

  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    const itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Initialise le menu en fonction des rôles de l'utilisateur.
   */
  initialize(): void {
    const filteredMenu = this.filterMenuByRoles(MENU);
    this.menuItems = filteredMenu;
  }

  /**
   * Filtre le menu en fonction des rôles de l'utilisateur.
   * @param menuItems Les éléments de menu à filtrer.
   * @returns Les éléments de menu filtrés.
   */
  filterMenuByRoles(menuItems: MenuItem[]): MenuItem[] {
    const userRoles = this.roles;
    if (!userRoles || userRoles.length === 0) {
      return [];
    }

    return menuItems.reduce((acc, item) => {
      // Les titres sont toujours affichés
      if (item.isTitle) {
        acc.push(item);
        return acc;
      }

      // Vérifie d'abord l'accès à l'élément principal
      const isItemAllowed = userRoles.some(role => item.rolesAllowed.includes(role));
      
      // Si l'élément principal a des sous-éléments
      if (item.subItems) {
        // Filtre les sous-éléments de manière récursive
        const filteredSubItems = this.filterMenuByRoles(item.subItems);
        // Si des sous-éléments restent, ajoute l'élément principal et ses sous-éléments filtrés
        if (filteredSubItems.length > 0) {
          const newItem = { ...item, subItems: filteredSubItems };
          acc.push(newItem);
        }
      } else {
        // Si c'est un lien de niveau supérieur, on l'ajoute s'il est autorisé
        if (isItemAllowed) {
          acc.push(item);
        }
      }
      return acc;
    }, []);
  }

  /**
   * Renvoie true ou false si l'élément de menu donné a des enfants ou non.
   * @param item menuItem
   */
  hasItems(item: MenuItem): boolean {
    return item.subItems !== undefined && item.subItems.length > 0;
  }
}