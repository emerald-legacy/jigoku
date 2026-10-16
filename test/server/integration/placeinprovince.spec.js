import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { placeInProvince } from '../../../build/server/game/GameActions/GameActions.js';

describe('placing a card into a province', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['sudden-tempest', 'iron-mine']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.tempest = this.player1.findCardByName('sudden-tempest');
            this.ironMine = this.player1.findCardByName('iron-mine');
            this.place = (card, properties) => {
                const context = new ThenAbility(this.whisperer, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => placeInProvince(properties).resolve(card, context));
                this.game.continue();
            };
        });

        it('adds it faceup without revealing it, so Rally does not trigger', function() {
            const inProvince = this.player1.player.getDynastyCardsInProvince('province 1');
            this.place(this.tempest, { destination: 'province 1' });

            expect(this.tempest.location).toBe('province 1');
            expect(this.tempest.facedown).toBe(false);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.player.getDynastyCardsInProvince('province 1')).toEqual(jasmine.arrayWithExactContents([...inProvince, this.tempest]));
        });

        it('discards the cards already there when asked to', function() {
            const inProvince = this.player1.player.getDynastyCardsInProvince('province 1');
            this.place(this.ironMine, { destination: 'province 1', discard: 'all' });

            expect(this.ironMine.location).toBe('province 1');
            for(const card of inProvince) {
                expect(card.location).toBe('dynasty discard pile');
            }
        });
    });
});
