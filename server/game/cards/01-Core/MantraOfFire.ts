import { Element } from '../../Constants.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { makeMantra } from '../makeMantra.js';

export default makeMantra('mantra-of-fire', Element.Fire, 'Add 1 fate to a monk and draw a card', placeFate(), 'add a fate to {0} and draw a card');
