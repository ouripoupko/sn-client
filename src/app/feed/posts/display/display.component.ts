import { Component, OnInit } from '@angular/core';

export interface Post {
  owner: string;
  time: string;
  text: string;
}

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  posts: Post[] = [
    {owner: 'Udi', time: '10/10/2021 10:10', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque sodales ut. Elementum tempus egestas sed sed risus pretium quam vulputate. Dui nunc mattis enim ut tellus elementum sagittis vitae et. Vitae ultricies leo integer malesuada nunc vel. Dictumst quisque sagittis purus sit amet. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Arcu cursus vitae congue mauris. Mauris rhoncus aenean vel elit. Gravida rutrum quisque non tellus. Lectus sit amet est placerat in egestas erat imperdiet. Ante in nibh mauris cursus mattis molestie a iaculis at. Quis hendrerit dolor magna eget. At urna condimentum mattis pellentesque id nibh tortor. Pharetra diam sit amet nisl suscipit.'},
    {owner: 'Nimrod', time: '11/11/2021 11:11', text: 'Ultricies mi quis hendrerit dolor magna eget est lorem. Id diam vel quam elementum pulvinar etiam non quam lacus. Et magnis dis parturient montes. Vitae purus faucibus ornare suspendisse sed nisi lacus. Blandit turpis cursus in hac. Porttitor leo a diam sollicitudin tempor id eu nisl. Tincidunt ornare massa eget egestas purus viverra. Commodo elit at imperdiet dui accumsan sit amet nulla. Iaculis eu non diam phasellus vestibulum. Enim nec dui nunc mattis enim ut tellus elementum sagittis. Blandit volutpat maecenas volutpat blandit. Proin fermentum leo vel orci porta non pulvinar neque laoreet. Id aliquet risus feugiat in ante metus dictum at tempor. Tellus in metus vulputate eu scelerisque felis. Massa ultricies mi quis hendrerit. Bibendum est ultricies integer quis auctor.'},
    {owner: 'ouri', time: '12/12/2021 12:12', text:'Nisl tincidunt eget nullam non nisi. Dignissim suspendisse in est ante in nibh mauris. Pharetra vel turpis nunc eget. Fermentum leo vel orci porta non pulvinar neque laoreet suspendisse. Vel risus commodo viverra maecenas. Adipiscing enim eu turpis egestas pretium aenean pharetra. Quisque sagittis purus sit amet volutpat. Elementum integer enim neque volutpat ac tincidunt vitae semper. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Quisque non tellus orci ac auctor augue. Donec enim diam vulputate ut pharetra sit amet aliquam id. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Lorem sed risus ultricies tristique nulla aliquet enim. Nulla pharetra diam sit amet nisl suscipit. Et malesuada fames ac turpis egestas integer eget aliquet nibh. Erat velit scelerisque in dictum non consectetur. Mauris pellentesque pulvinar pellentesque habitant morbi. Sed blandit libero volutpat sed. Enim nunc faucibus a pellentesque sit amet.'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
