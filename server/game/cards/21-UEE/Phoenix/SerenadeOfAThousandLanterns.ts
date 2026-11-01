import { perConflict } from '../../../AbilityLimit.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import { CardType, TargetMode, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class SerenadeOfAThousandLanterns extends DrawCard {
    static id = 'serenade-of-a-thousand-lanterns';

    override setupCardAbilities() {
        this.conflictAction('Send characters home')
            .ifCondition((context) => controlsShugenja(context.player))
            .targetCards({
                activePromptTitle: 'Choose characters adding up to 4 printed cost',
                numCards: Infinity,
                mode: TargetMode.MaxStat,
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 4,
                cardType: CardType.Character,
                // tokens have no printed cost (ruling #1116)
                cardCondition: (card, _context) => card.isParticipating() && !card.isUnique() && card.getCost() !== null
            }, sendHome())
            .max(perConflict(1))
            .afterwards()
            .onAffinity(Trait.Fire)
            .gainHonor(1);
    }
}
