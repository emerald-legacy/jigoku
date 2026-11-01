describe('Shosuro Miyako', function() {
    integration(function() {
        describe('Shosuro Miyako\'s reaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: ['shosuro-miyako'],
                        hand: ['stoic-gunso', 'fine-katana']
                    },
                    player2: {
                        fate: 10,
                        inPlay: ['doji-whisperer', 'border-rider'],
                        hand: ['banzai', 'charge', 'stoic-gunso']
                    }
                });
                this.miyako = this.player1.findCardByName('shosuro-miyako');
                this.gunso = this.player1.findCardByName('stoic-gunso');
                this.katana = this.player1.findCardByName('fine-katana');
                this.p2Whisperer = this.player2.findCardByName('doji-whisperer');
                this.borderRider = this.player2.findCardByName('border-rider');
                this.p2Gunso = this.player2.findCardByName('stoic-gunso');
            });

            it('lets your opponent discard 1 card at random after you play a character from your hand', function() {
                this.player1.playCharacterFromHand(this.gunso);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.miyako);
                this.player1.clickCard(this.miyako);
                expect(this.player2).toHavePromptButton('Discard at random');
                expect(this.player2).toHavePromptButton('Dishonor a character');
                this.player2.clickPrompt('Discard at random');
                expect(this.player2.hand.length).toBe(2);
                expect(this.player2.conflictDiscard.length).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Shosuro Miyako to force player2 to discard at random');
            });

            it('lets your opponent choose and dishonor a character they control after you play a character from your hand', function() {
                this.player1.playCharacterFromHand(this.gunso);
                this.player1.clickCard(this.miyako);
                this.player2.clickPrompt('Dishonor a character');
                expect(this.player2).toHavePrompt('Choose a character to dishonor');
                expect(this.player2).toBeAbleToSelect(this.p2Whisperer);
                expect(this.player2).toBeAbleToSelect(this.borderRider);
                expect(this.player2).not.toBeAbleToSelect(this.miyako);
                expect(this.player2).not.toBeAbleToSelect(this.gunso);
                this.player2.clickCard(this.borderRider);
                expect(this.borderRider.isDishonored).toBe(true);
                expect(this.p2Whisperer.isDishonored).toBe(false);
                expect(this.player2.hand.length).toBe(3);
                expect(this.getChatLogs(5)).toContain('player2 chooses to dishonor Border Rider');
            });

            it('does not trigger after your opponent plays a character from their hand', function() {
                this.player1.pass();
                this.player2.playCharacterFromHand(this.p2Gunso);
                expect(this.p2Gunso.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('does not trigger after you play an attachment from your hand', function() {
                this.player1.playAttachment(this.katana, this.miyako);
                expect(this.katana.parent).toBe(this.miyako);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('makes your opponent dishonor a character when their hand is empty (ruling #106)', function() {
                this.player2.moveCard('banzai', 'conflict deck');
                this.player2.moveCard('charge', 'conflict deck');
                this.player2.moveCard(this.p2Gunso, 'conflict deck');
                expect(this.player2.hand.length).toBe(0);
                this.player1.playCharacterFromHand(this.gunso);
                this.player1.clickCard(this.miyako);
                expect(this.player2).not.toHavePromptButton('Discard at random');
                expect(this.player2).toHavePrompt('Choose a character to dishonor');
                this.player2.clickCard(this.p2Whisperer);
                expect(this.p2Whisperer.isDishonored).toBe(true);
            });

            it('makes your opponent discard at random when every character they control is dishonored (ruling #106)', function() {
                this.p2Whisperer.dishonor();
                this.borderRider.dishonor();
                this.player1.playCharacterFromHand(this.gunso);
                this.player1.clickCard(this.miyako);
                expect(this.player2).not.toHavePromptButton('Dishonor a character');
                expect(this.player2.hand.length).toBe(2);
                expect(this.player2.conflictDiscard.length).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Shosuro Miyako to force player2 to discard at random');
            });
        });

        describe('Shosuro Miyako in the dynasty phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        inPlay: ['shosuro-miyako'],
                        dynastyDiscard: ['doji-whisperer']
                    },
                    player2: {
                        hand: ['banzai', 'charge']
                    }
                });
                this.miyako = this.player1.findCardByName('shosuro-miyako');
                this.p1Whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
            });

            it('does not trigger after you play a character from a province', function() {
                this.player1.clickCard(this.p1Whisperer);
                this.player1.clickPrompt('0');
                expect(this.p1Whisperer.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });

        describe('Shosuro Miyako and a character played as if from hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: ['shosuro-miyako'],
                        dynastyDiscard: ['hidden-moon-dojo', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['border-rider'],
                        hand: ['banzai', 'charge']
                    }
                });
                this.miyako = this.player1.findCardByName('shosuro-miyako');
                this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
                this.dojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.borderRider = this.player2.findCardByName('border-rider');
            });

            it('triggers after you play a character from a province as if it were in your hand (rulings #425, #920)', function() {
                this.player1.clickCard(this.whisperer);
                expect(this.player1).toHavePrompt('Choose additional fate');
                this.player1.clickPrompt('0');
                expect(this.whisperer.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.miyako);
                this.player1.clickCard(this.miyako);
                this.player2.clickPrompt('Discard at random');
                expect(this.player2.hand.length).toBe(1);
            });
        });
    });
});
