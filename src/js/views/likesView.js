import { elements } from './base';
import { limitRecipeTitile } from './searchView';

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.header__likes use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = (like) => {
  const markup = `
		<li>
			<a class="likes__link" href="#${like.id}">
				<figure class="likes__fig">
					<img src="${like.img}" alt="${like.title}">
				</figure>
				<div class="likes__data">
					<h4 class="likes__name">${limitRecipeTitile(like.title)}</h4>
					<p class="likes__author">${like.creditsText}</p>
				</div>
			</a>
		</li>
	`;

  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if (el) el.parentElement.removeChild(el);
};
