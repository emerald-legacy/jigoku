import DrawCard from '../../DrawCard.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, sendHome } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class DirectingTheBattle extends DrawCard {
    static id = 'directing-the-battle';

    setupCardAbilities() {
        this.conflictAction('Direct the Battle')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Any
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Move this character home': sendHome(context => ({
                    target: context.targets.character
                })),
                'Give +3 Military': cardLastingEffect(context => ({
                    effect: modifyMilitarySkill(3),
                    target: context.targets.character
                })),
                'Prevent bowing during conflict': cardLastingEffect(context => ({
                    effect: cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    }),
                    target: context.targets.character
                }))
            })
            .chatText('{1}{2}{3}{4}', context => {
                if(context.selects.select.choice === 'Move this character home') {
                    return ['send ', context.targets.character, ' home', ''];
                }
                if(context.selects.select.choice === 'Give +3 Military') {
                    return ['give ', context.targets.character, ' +3', 'military'];
                }
                return ['prevent ', context.targets.character, ' from being bowed by opponent\'s card effects', ''];
            });
    }
}


export default DirectingTheBattle;
