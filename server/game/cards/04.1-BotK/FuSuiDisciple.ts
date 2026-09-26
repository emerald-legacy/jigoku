import DrawCard from '../../DrawCard.js';
import { Players, CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'fu-sui-disciple-air';

class FuSuiDisciple extends DrawCard {
    static id = 'fu-sui-disciple';

    setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .selectIf('player', {
                activePromptTitle: 'Choose a player',
                targets: true
            }, {
                [this.owner.name]: context => context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(this.owner),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: context => context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(this.owner.opponent)
            })
            .target('character', {
                dependsOn: 'player',
                player: context => context.selects.player.choice === context.player.name ? Players.Self : Players.Opponent,
                activePromptTitle: 'Choose a character to be honored or dishonored',
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    let player = context.selects.player.choice === context.player.name ? context.player : context.player.opponent;
                    return !card.isHonored && !card.isDishonored && card.controller === player;
                }
            })
            .select('effect', {
                dependsOn: 'character'
            }, {
                'Honor this character': AbilityDsl.actions.honor(context => ({ target: context.targets.character })),
                'Dishonor this character': AbilityDsl.actions.dishonor(context => ({ target: context.targets.character }))
            });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Element.Air
        });
        return symbols;
    }
}


export default FuSuiDisciple;
