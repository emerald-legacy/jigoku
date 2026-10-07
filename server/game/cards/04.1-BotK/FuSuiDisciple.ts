import DrawCard from '../../DrawCard.js';
import { Players, CardType, Element } from '../../Constants.js';
import { dishonor, honor } from '../../GameActions/GameActions.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'fu-sui-disciple-air', element: Element.Air };

class FuSuiDisciple extends DrawCard {
    static id = 'fu-sui-disciple';

    setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .select({
                name: 'player',
                activePromptTitle: 'Choose a player',
                targets: true
            }, {
                [this.owner.name]: () => hasClaimedRing(this, elementSymbol.key, this.owner),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: () => this.owner.opponent !== undefined && hasClaimedRing(this, elementSymbol.key, this.owner.opponent)
            })
            .target({
                name: 'character',
                dependsOn: 'player',
                player: context => context.selects.player.choice === context.player.name ? Players.Self : Players.Opponent,
                activePromptTitle: 'Choose a character to be honored or dishonored',
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const player = context.selects.player.choice === context.player.name ? context.player : context.player.opponent;
                    return !card.isHonored && !card.isDishonored && card.controller === player;
                }
            })
            .select({
                name: 'effect',
                dependsOn: 'character'
            }, {
                'Honor this character': honor(context => ({ target: context.targets.character })),
                'Dishonor this character': dishonor(context => ({ target: context.targets.character }))
            });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default FuSuiDisciple;
