import { msg } from '../../GameChat.js';
import { reduceCost } from '../../effects.js';
import { putIntoConflict, reveal, selectCards, sequential } from '../../GameActions/GameActions.js';
import { CardType, Location, Players, TargetMode } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class StokeInsurrection extends DrawCard {
    static id = 'stoke-insurrection';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) =>
                context.player.opponent !== undefined && this.getFaceDownProvinceCards(context.player.opponent) >= 4,
            effect: reduceCost({
                amount: 2,
                match: (card, source) => card === source
            })
        });

        this.action('Put characters into play')
            .condition((context) => context.game.isDuringConflict() && context.player.opponent !== undefined)
            .gameAction(sequential([
                reveal((context) => ({
                    target: context.player.opponent ? context.player.opponent.getDynastyCardsInProvince(Location.Provinces) : []
                })),
                selectCards((context) => ({
                    activePromptTitle: 'Choose up to two characters',
                    numCards: 2,
                    targets: true,
                    mode: TargetMode.MaxStat,
                    cardStat: (card: DrawCard) => card.getCost(),
                    maxStat: () => 6,
                    optional: true,
                    cardType: CardType.Character,
                    location: [Location.Provinces],
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isFaceup() && card.allowGameAction('putIntoConflict', context),
                    message: (context, cards) => msg`${context.player} puts ${cards} into play into the conflict`,
                    gameAction: putIntoConflict()
                }))
            ]))
            .chatText('reveal {1}\'s dynasty cards and put up to two of them into play', (context) => context.player.opponent ? [context.player.opponent] : []);
    }

    private getFaceDownProvinceCards(player: Player) {
        return player
            .getDynastyCardsInProvince(Location.Provinces)
            .filter((card) => card.isFacedown() && card.controller === player).length;
    }
}
