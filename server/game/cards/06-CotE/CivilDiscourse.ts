import DrawCard from '../../DrawCard.js';
import { PlayType, DuelType, AbilityType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CivilDiscourse extends DrawCard {
    static id = 'civil-discourse';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: '{0} gains \'Increase the cost to play each card in your hand by 1.\'',
                messageArgs: duel => duel.loser,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.loser,
                    effect: AbilityDsl.effects.gainAbility(AbilityType.Persistent, {
                        targetController: Players.Self,
                        effect: AbilityDsl.effects.increaseCost({
                            amount: 1,
                            playingTypes: PlayType.PlayFromHand
                        })
                    })
                })
            }
        });
    }
}


export default CivilDiscourse;
