import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { cardLastingEffect } from '../../../build/server/game/GameActions/GameActions.js';
import { cardCannot } from '../../../build/server/game/Effects/Library/cardCannot.js';
import { Duration, Location, RestrictionType } from '../../../build/server/game/Constants.js';

describe('Duplicate Unique', function() {
    integration(function() {
        describe('Perfect Guest\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        dynastyDiscard: ['togashi-yokuni']
                    },
                    player2: {
                        inPlay: ['perfect-guest']
                    }
                });
                this.yokuni = this.player1.findCardByName('togashi-yokuni', 'play area');
                this.yokuni2 = this.player1.findCardByName('togashi-yokuni', 'dynasty discard pile');
                this.guest = this.player2.findCardByName('perfect-guest');
                this.player1.placeCardInProvince(this.yokuni2, 'province 1');
                this.yokuni2.faceup = true;
            });

            it('should add a fate if you control the unique', function() {
                const fate = this.yokuni.fate;
                this.player1.clickCard(this.yokuni2);
                expect(this.yokuni2.location).toBe('dynasty discard pile');
                expect(this.yokuni.fate).toBe(fate + 1);
            });

            describe('when one copy can\'t have fate placed on it', function() {
                beforeEach(function() {
                    this.cannotPlaceFate = (target) => {
                        const context = new ResolvableAbility(this.yokuni, {}).createContext(this.player1.player);
                        this.game.queueSimpleStep(() => cardLastingEffect({
                            duration: Duration.Custom,
                            targetLocation: Location.Any,
                            effect: cardCannot(RestrictionType.PlaceFate)
                        }).resolve(target, context));
                        this.game.continue();
                    };
                });

                it('should not let you discard the duplicate if it is the copy in play', function() {
                    this.cannotPlaceFate(this.yokuni);
                    const fate = this.yokuni.fate;
                    this.player1.clickCard(this.yokuni2);
                    expect(this.yokuni2.location).toBe('province 1');
                    expect(this.yokuni.fate).toBe(fate);
                    expect(this.player1).toHavePrompt('Play cards from provinces');
                });

                it('should still add a fate if it is the duplicate being discarded', function() {
                    this.cannotPlaceFate(this.yokuni2);
                    const fate = this.yokuni.fate;
                    this.player1.clickCard(this.yokuni2);
                    expect(this.yokuni2.location).toBe('dynasty discard pile');
                    expect(this.yokuni.fate).toBe(fate + 1);
                });
            });

            it('should not add a fate if you don\'t control the unique (and should also not let you play)', function() {
                this.player1.clickCard(this.yokuni);
                this.player1.clickCard(this.guest);
                this.player2.pass();
                this.player1.clickCard(this.yokuni);
                expect(this.yokuni.controller).toBe(this.player2.player);
                const fate = this.yokuni.fate;
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.yokuni2);
                expect(this.yokuni2.location).toBe('province 1');
                expect(this.yokuni.fate).toBe(fate);
                expect(this.player1).toHavePrompt('Play cards from provinces');
            });
        });
    });
});
