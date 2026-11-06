describe('Tattooed Wanderer', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-whisperer', 'underhanded-samurai'],
                    hand: ['tattooed-wanderer']
                },
                player2: {
                    inPlay: ['border-rider', 'akodo-gunso'],
                    provinces: ['entrenched-position']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.underhanded = this.player1.findCardByName('underhanded-samurai');
            this.wanderer = this.player1.findCardByName('tattooed-wanderer');
            this.borderRider = this.player2.findCardByName('border-rider');
            this.akodoGunso = this.player2.findCardByName('akodo-gunso');
            this.entrenched = this.player2.findCardByName('entrenched-position');
        });

        it('can be played as a character', function() {
            this.player1.clickCard(this.wanderer);
            expect(this.player1).toHavePromptButton('Play this character');
            expect(this.player1).toHavePromptButton('Play Tattooed Wanderer as an attachment');
            this.player1.clickPrompt('Play this character');
            this.player1.clickPrompt('0');
            expect(this.wanderer.location).toBe('play area');
            expect(this.wanderer.type).toBe('character');
        });

        it('gives covert to the attached character when played as an attachment', function() {
            expect(this.whisperer.isCovert()).toBe(false);
            this.player1.playAttachment(this.wanderer, this.whisperer);
            expect(this.wanderer.type).toBe('attachment');
            expect(this.wanderer.parent).toBe(this.whisperer);
            expect(this.whisperer.isCovert()).toBe(true);
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.entrenched);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Doji Whisperer');
            this.player1.clickCard(this.borderRider);
            expect(this.player2).toHavePrompt('Choose defenders');
            this.player2.clickCard(this.borderRider);
            this.player2.clickCard(this.akodoGunso);
            expect(this.borderRider.inConflict).toBe(false);
            expect(this.akodoGunso.inConflict).toBe(true);
        });

        it('does not add its printed skills to the attached character (ruling #112)', function() {
            this.player1.playAttachment(this.wanderer, this.whisperer);
            expect(this.wanderer.parent).toBe(this.whisperer);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
        });

        it('gives only one instance of covert to a character that already has covert (ruling #113)', function() {
            this.player1.playAttachment(this.wanderer, this.underhanded);
            expect(this.wanderer.parent).toBe(this.underhanded);
            expect(this.underhanded.isCovert()).toBe(true);
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.entrenched);
            this.player1.clickCard(this.underhanded);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Underhanded Samurai');
            this.player1.clickCard(this.borderRider);
            expect(this.player2).toHavePrompt('Choose defenders');
            this.player2.clickCard(this.borderRider);
            this.player2.clickCard(this.akodoGunso);
            expect(this.borderRider.inConflict).toBe(false);
            expect(this.akodoGunso.inConflict).toBe(true);
        });
    });
});
