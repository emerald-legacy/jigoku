import DrawCard from '../../DrawCard.js';
import { PlayType, DuelType, AbilityType, Players } from '../../Constants.js';
import { gainAbility, increaseCost } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class CivilDiscourse extends DrawCard {
    static id = 'civil-discourse';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: '{0} gains \'Increase the cost to play each card in your hand by 1.\'',
                messageArgs: duel => duel.loser,
                gameAction: duel => cardLastingEffect({
                    target: duel.loser,
                    effect: gainAbility(AbilityType.Persistent, {
                        targetController: Players.Self,
                        effect: increaseCost({
                            amount: 1,
                            playingTypes: PlayType.PlayFromHand
                        })
                    })
                })
            }));
    }
}


export default CivilDiscourse;
