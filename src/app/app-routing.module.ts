import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'list',
        loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
    },
    {
        path: 'chatbot',
        loadChildren: () => import('./chatbot/chatbot.module').then(m => m.ChatbotPageModule)
    },
    {
        path: 'chatbot2',
        loadChildren: () => import('./chatbot2/chatbot2.module').then(m => m.Chatbot2PageModule)
    },
    {
        path: 'chatbot3',
        loadChildren: () => import('./chatbot3/chatbot3.module').then(m => m.Chatbot3PageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
