describe('One With the Sea', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                    hand: ['one-with-the-sea'],
                    dynastyDiscard: ['secluded-shrine']
                },
                player2: {
                    inPlay: ['kakita-yoshi']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.sea = this.player1.findCardByName('one-with-the-sea');
            this.shrine = this.player1.findCardByName('secluded-shrine');
            this.player1.placeCardInProvince(this.shrine, 'province 1');
            this.shrine.facedown = false;

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();

            this.player1.clickCard(this.shrine);
            this.player1.clickRing('fire');
        });

        it('should not prompt you to choose an action if you don\'t have the water ring', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays One with the Sea to move Doji Kuwanan into the conflict');
        });

        it('should prompt you to choose an action if you have the water ring', function() {
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            const fate = this.player1.fate;
            expect(this.player1).toHavePrompt('One with the Sea');
            expect(this.player1).toHavePromptButton('Move a character you control to the conflict');
            expect(this.player1).toHavePromptButton('Move any character to the conflict');

            this.player1.clickPrompt('Move any character to the conflict');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.yoshi);
            expect(this.yoshi.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays One with the Sea, spending 1 fate to move Kakita Yoshi into the conflict');
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('if you don\'t spend the fate', function() {
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            expect(this.player1).toHavePrompt('One with the Sea');
            expect(this.player1).toHavePromptButton('Move a character you control to the conflict');
            expect(this.player1).toHavePromptButton('Move any character to the conflict');

            this.player1.clickPrompt('Move a character you control to the conflict');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
        });
    });
});

describe('One With the Sea and cost increases', function() {
    integration(function() {
        describe('when events cost 1 more', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'doji-kuwanan'],
                        hand: ['one-with-the-sea']
                    },
                    player2: {
                        inPlay: ['kakita-yoshi'],
                        hand: ['into-the-storm']
                    }
                });
                this.yoshi = this.player2.findCardByName('kakita-yoshi');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.sea = this.player1.findCardByName('one-with-the-sea');
                this.player1.claimRing('water');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: []
                });
                this.player2.clickCard('into-the-storm');
            });

            it('cannot spend 1 fate on top of the increased cost with only 1 fate', function() {
                this.player1.fate = 1;
                this.player1.clickCard(this.sea);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            });

            it('can spend 1 fate on top of the increased cost with 2 fate', function() {
                this.player1.fate = 2;
                this.player1.clickCard(this.sea);
                this.player1.clickPrompt('Move any character to the conflict');
                this.player1.clickCard(this.yoshi);
                expect(this.yoshi.isParticipating()).toBe(true);
                expect(this.player1.fate).toBe(0);
            });
        });
    });
});

describe('One With the Sea - max 1 per round', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                    hand: ['one-with-the-sea', 'one-with-the-sea']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'doji-whisperer']
                }
            });
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.sea = this.player1.filterCardsByName('one-with-the-sea')[0];
            this.sea2 = this.player1.filterCardsByName('one-with-the-sea')[1];
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
        });

        it('can only use the second ability once per round', function() {
            this.player2.pass();
            this.player1.clickCard(this.sea);
            this.player1.clickPrompt('Move any character to the conflict');
            this.player1.clickCard(this.yoshi);
            expect(this.yoshi.isParticipating()).toBe(true);
            expect(this.player1.fate).toBe(9);

            this.player2.pass();
            this.player1.clickCard(this.sea2);
            expect(this.player1).not.toHavePromptButton('Move any character to the conflict');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.isParticipating()).toBe(true);
            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.player1.fate).toBe(9);
        });
    });
});
