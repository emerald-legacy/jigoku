import { Element } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';
import { makeMantra } from '../makeMantra.js';

export default makeMantra('mantra-of-water', Element.Water, 'Ready a monk and draw a card', ready(), 'ready {0} and draw a card');
